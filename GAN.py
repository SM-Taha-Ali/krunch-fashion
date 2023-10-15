import torch.nn as nn
import torch.nn.functional as F

# Self maden Convolution function
def Convolution_func(in_channels, out_channels, kernel_size, stride=2, padding=1, batch_norm=True):
    """Creates a convolutional layer, with optional batch normalization.
    """
    layers = []
    conv_layer = nn.Conv2d(in_channels, out_channels,
                           kernel_size, stride, padding, bias=False)

    # append conv layer
    layers.append(conv_layer)

    if batch_norm:
        # append batchnorm layer
        layers.append(nn.BatchNorm2d(out_channels))

    # using Sequential container
    return nn.Sequential(*layers)

class Discriminator(nn.Module):

    def __init__(self, conv_dim=64):
        """
        Discriminator Module Initialization
        """
        super(Discriminator, self).__init__()

        # Layers definition
        self.conv_dim = conv_dim
        # 64x64 input
        self.conv1 = Convolution_func(3, conv_dim, 4, batch_norm=False)
        # first layer, no batch_norm
        # 32x32 out
        self.conv2 = Convolution_func(conv_dim, conv_dim*2, 4)
        # 16x16 out
        self.conv3 = Convolution_func(conv_dim*2, conv_dim*4, 4)
        # 8x8 out
        self.conv4 = Convolution_func(conv_dim*4, conv_dim*8, 4)
        # 4x4 out
        self.conv5 = Convolution_func(conv_dim*8, conv_dim*16, 4)
        # 2*2 out
        self.last = Convolution_func(conv_dim*16,1,4,batch_norm=False)

    def forward(self, x):
        """
        Forward Propagation Pass
        :X -> Input
        :return -> Discriminator logits
        """
        # Forward pass
        out = F.leaky_relu(self.conv1(x), 0.2)
        out = F.leaky_relu(self.conv2(out), 0.2)
        out = F.leaky_relu(self.conv3(out), 0.2)
        out = F.leaky_relu(self.conv4(out), 0.2)
        out = F.leaky_relu(self.conv5(out), 0.2)
        out = self.last(out)

        return out
        return x


# Deconvolution Function
def Deconvolution_func(in_channels, out_channels, kernel_size=4, stride=2, padding=1, batch_norm=True):
    """Creates a transposed-convolutional layer, with optional batch normalization.
    """
    ## create a sequence of transpose + optional batch norm layers
    layers = []
    conv_transpose = nn.ConvTranspose2d(in_channels,out_channels, kernel_size, stride,padding,bias=False)
    # append conv layer
    layers.append(conv_transpose)
    if batch_norm:
        # append batchnorm layer
        layers.append(nn.BatchNorm2d(out_channels))
    # using Sequential container
    return nn.Sequential(*layers)

class Generator(nn.Module):
    def __init__(self, z_size, conv_dim=64):
        """
        Initialize the Generator Module
        :param z_size: The length of the input latent vector, z
        :param conv_dim: The depth of the inputs to the *last*
        transpose convolutional layer
        """
        super(Generator, self).__init__()

        # complete init function
        self.conv_dim = conv_dim
        # first, fully-connected layer
        self.fc = nn.Linear(z_size, conv_dim*16*2*2)

        # transpose conv layers
        self.t_conv1 = Deconvolution_func(conv_dim*16, conv_dim*8, 4)
        self.t_conv2 = Deconvolution_func(conv_dim*8, conv_dim*4, 4)
        self.t_conv3 = Deconvolution_func(conv_dim*4, conv_dim*2, 4)
        self.t_conv4 = Deconvolution_func(conv_dim*2, conv_dim, 4)
        self.t_conv5 = Deconvolution_func(conv_dim, 3, 4, batch_norm=False)

    def forward(self, x):
        """
        Forward Propagation Pass of NN
        :param x -> The input of NN
        :return -> 64x64x3 Tensor image as output
        """
        # define feedforward behavior
        out = self.fc(x)
        out = out.view(-1, self.conv_dim*16, 2, 2) # (batch_size, depth, 2, 2)

        # hidden transpose conv layers + relu
        #try leaky relu here
        out = F.leaky_relu(self.t_conv1(out))
        out = F.leaky_relu(self.t_conv2(out))
        out = F.leaky_relu(self.t_conv3(out))
        out = F.leaky_relu(self.t_conv4(out))
        # last layer + tanh activation
        out = self.t_conv5(out)
        out = F.tanh(out)
        return out
