import React from "react";

class SearchBar extends React.Component {

    state = {term: ''}

    onFormSubmit = (e) => {
        e.preventDefault();
        this.props.sendToApp(this.state.term);
    }

    render() {
        return (
            <div className="ui padded yellow segment">
                <div className="ui bottom left attached label">FASHION-Chek👗  <a
                    href="/">we make Design that you Love.</a></div>
                <form className="ui fluid form" onSubmit={this.onFormSubmit}>
                    <div className="inline fields">
                        <div className="thirteen wide field">
                            <div className={`ui icon input ${this.props.loading}`}>
                                <input type="text" placeholder="Search Copyright-free images. Type Hit Enter :) " value={this.state.term}
                                       onChange={(e) => {
                                           this.setState({term: e.target.value})
                                       }}/>
                                <i className="search icon"></i>
                            </div>
                        </div>
                        <div className="five wide field">
                            
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}


export default SearchBar;