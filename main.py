from flask import Flask, request, jsonify
import os
from PIL import Image
import numpy as np
from tqdm import tqdm
import cv2
import warnings
import torch
import torch.nn.functional as F
import torchvision.transforms as transforms
from segmentation.data.base_dataset import Normalize_image
from segmentation.utils.saving_utils import load_checkpoint_mgpu
from segmentation.networks import U2NET
from torch.nn import init
from GAN import Generator, Discriminator
import matplotlib.pyplot as plt
import base64
import io
from flask_cors import CORS
from pathlib import Path
import json

app = Flask(__name__)
CORS(app)  # This line enables CORS for your entire app


# Set the path to the directory where images will be saved
UPLOAD_FOLDER = './images'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Set the path to the directory where segmented masks will be saved
SEGMENTED_FOLDER = './segmented'
if not os.path.exists(SEGMENTED_FOLDER):
    os.makedirs(SEGMENTED_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

device = "cpu"

do_palette = True
image_dir = "./images"
result_dir = "./segmented"
checkpoint_path =  "./cloth_segm_u2net_latest.pth"

def weights_init_normal(m):
    classname = m.__class__.__name__
    # TODO: Apply initial weights to convolutional and linear layers
    if 'Conv' in classname:
        torch.nn.init.normal_(m.weight.data, 0.0, 0.02)
    elif 'Linear' in classname:
        torch.nn.init.normal_(m.weight.data, 0.0, 0.02)

# Define model hyperparams
def build_network(d_conv_dim, g_conv_dim, z_size):
    # define discriminator and generator
    D = Discriminator(d_conv_dim)
    G = Generator(z_size=z_size, conv_dim=g_conv_dim)

    # initialize model weights
    D.apply(weights_init_normal)
    G.apply(weights_init_normal)

    return D, G


def get_palette(num_cls):
    """Returns the color map for visualizing the segmentation mask.
    Args:
        num_cls: Number of classes
    Returns:
        The color map
    """
    n = num_cls
    palette = [0] * (n * 3)
    for j in range(0, n):
        lab = j
        palette[j * 3 + 0] = 0
        palette[j * 3 + 1] = 0
        palette[j * 3 + 2] = 0
        i = 0
        while lab:
            palette[j * 3 + 0] |= ((lab >> 0) & 1) << (7 - i)
            palette[j * 3 + 1] |= ((lab >> 1) & 1) << (7 - i)
            palette[j * 3 + 2] |= ((lab >> 2) & 1) << (7 - i)
            i += 1
            lab >>= 3
    return palette

# Scale function
def Scaling_Func(x, feature_range=(-1, 1)):
    ''' Scalefunction takes in an image x and returns that image, scaled
    with a feature_range of pixel values from -1 to 1.
    '''

    # scale x from (0, 1) to feature_range and return scaled x
    x = x * 2 - 1
    return x

# Define a function to visualize generated samples
def visualize_samples(samples):
    encoded_samples = []
    for sample in samples:
        sample = (sample + 1) / 2.0  # Rescale to (0, 1) range
        sample = np.transpose(sample, (1, 2, 0))

        # Convert the PyTorch tensor to a NumPy array
        sample_np = sample.cpu().numpy()

        # Convert the image to bytes and encode it to base64
        img_byte_array = io.BytesIO()
        plt.imsave(img_byte_array, sample_np, format='png')
        img_base64 = base64.b64encode(img_byte_array.getvalue()).decode('utf-8')

        encoded_samples.append(img_base64)

    return encoded_samples


# Define the test function
def test(G, n_samples=10, z_size=200, load_model=True):
    # Load Generator and Discriminator if required
    if load_model:
        save_path = './ckpts2/'
        try:
            log_file = save_path + "log_file.txt"
            with open(log_file, 'r') as f:
                log_data = f.read()  ## last-saved model number
                print("Loading model #", log_data)
                f.close()

            G_state_dict = torch.load(save_path + 'G_ckpt' + str(4) + ".pth", map_location='cpu')
            G.load_state_dict(G_state_dict)

        except:
            print("No previous model found")
            return

    G.eval()  # Set the model to evaluation mode

    # Generate fake samples using the input image
    with torch.no_grad():
        z = np.random.uniform(-1, 1, size=(4, z_size))
        z = torch.from_numpy(z).float()
        random_fake_samples = G(z)

        encoded_fake_samples = visualize_samples(random_fake_samples)

    return encoded_fake_samples

# Define the test function
def test_with_image(G, n_samples=10, z_size=200, load_model=True):
    # Load Generator and Discriminator if required
    if load_model:
        save_path = './ckpts2/'
        try:
            log_file = save_path + "log_file.txt"
            with open(log_file, 'r') as f:
                log_data = f.read()  ## last-saved model number
                print("Loading model #", 6)
                f.close()

            G_state_dict = torch.load(save_path + 'G_ckpt' + str(6) + ".pth", map_location='cpu')
            G.load_state_dict(G_state_dict)

        except:
            print("No previous model found")
            return

    G.eval()  # Set the model to evaluation mode

    # Generate fake samples using the input image
    with torch.no_grad():
        z = np.random.uniform(-1, 1, size=(4, z_size))
        z = torch.from_numpy(z).float()
        random_fake_samples = G(z)

        encoded_fake_samples = visualize_samples(random_fake_samples)

    return encoded_fake_samples


def segment_image(input_path):
    transforms_list = []
    transforms_list += [transforms.ToTensor()]
    transforms_list += [Normalize_image(0.5, 0.5)]
    transform_rgb = transforms.Compose(transforms_list)

    net = U2NET(in_ch=3, out_ch=4)
    net = load_checkpoint_mgpu(net, checkpoint_path)
    net = net.to(device)
    net = net.eval()

    palette = get_palette(4)

    images_list = sorted(os.listdir(image_dir))
    pbar = tqdm(total=len(images_list))
    for image_name in images_list:
        img = Image.open(os.path.join(image_dir, image_name)).convert("RGB")
        image_tensor = transform_rgb(img)
        image_tensor = torch.unsqueeze(image_tensor, 0)

        output_tensor = net(image_tensor.to(device))
        output_tensor = F.log_softmax(output_tensor[0], dim=1)
        output_tensor = torch.max(output_tensor, dim=1, keepdim=True)[1]
        output_tensor = torch.squeeze(output_tensor, dim=0)
        output_tensor = torch.squeeze(output_tensor, dim=0)
        output_arr = output_tensor.cpu().numpy()

        output_img = Image.fromarray(output_arr.astype("uint8"), mode="L")
        if do_palette:
            output_img.putpalette(palette)
        image_name, extension = os.path.splitext(image_name)
        output_img.save(os.path.join(result_dir, image_name + ".png"))
        pbar.update(1)

    pbar.close()

@app.route('/upload', methods=['POST'])
def upload_and_segment():
    try:
        # if 'image' not in request.files:
        #     return jsonify({'error': 'No image part in the request'}), 400

        # image_file = request.files['image']

        # if image_file.filename == '':
        #     return jsonify({'error': 'No selected image'}), 400

        # if image_file:
        #     image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'input_image.jpg')
        #     image_file.save(image_path)

        #     segment_image(image_path)
        d_conv_dim = 64
        g_conv_dim = 64
        z_size = 200
        D, G = build_network(d_conv_dim, g_conv_dim, z_size)
        # Call the test function with the loaded and preprocessed input image
        encoded_fake_samples = test(G)
        encoded_fake_samples_str = json.dumps(encoded_fake_samples)
        return jsonify({'message': 'Image saved and segmented successfully', 'images':encoded_fake_samples_str}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/upload_with_image', methods=['POST'])
def upload_and_segment_withImage():
    try:
        # if 'image' not in request.files:
        #     return jsonify({'error': 'No image part in the request'}), 400

        # image_file = request.files['image']

        # if image_file.filename == '':
        #     return jsonify({'error': 'No selected image'}), 400

        # if image_file:
        #     image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'input_image.jpg')
        #     image_file.save(image_path)

        #     segment_image(image_path)
        d_conv_dim = 64
        g_conv_dim = 64
        z_size = 200
        D, G = build_network(d_conv_dim, g_conv_dim, z_size)
        # Call the test function with the loaded and preprocessed input image
        encoded_fake_samples = test_with_image(G)
        encoded_fake_samples_str = json.dumps(encoded_fake_samples)
        return jsonify({'message': 'Image saved and segmented successfully', 'images':encoded_fake_samples_str}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if os.environ.get("FLASK_ENV") == "production":
    frontend_path = Path(__file__).resolve().parent / "client" / "build"

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        file_path = frontend_path / path
        if file_path.exists():
            return file_path.read_text()
        else:
            return (frontend_path / "index.html").read_text()
        
frontend_path = Path(__file__).resolve().parent / "client" / "build"

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    file_path = frontend_path / path
    if file_path.exists():
        return file_path.read_text()
    else:
        return (frontend_path / "index.html").read_text()

if __name__ == '__main__':
    app.run(debug=True)
