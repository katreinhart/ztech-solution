import React, { Component } from 'react';
import { SortableContainer, SortableHandle, SortableElement, arrayMove } from 'react-sortable-hoc';
import axios from 'axios';

const SortablePreference = SortableElement(({value, id}) =>
  <li className = "list-item"
    key= {id} ><DragHandle />
    {value}
    <input type="checkbox"></input>
  </li>
)

const DragHandle = SortableHandle(() => <span>&#9776; </span>);

const SortablePreferences = SortableContainer (({items}) => {
    return(
      <ul className = "sortable-list">
        {items.map((value, index) => (
          <SortablePreference
            key={`item-${value}`}
            index={index}
            value={value}
          />
        ))}
      </ul>
    )
  }
);

class PreferenceCenter extends Component  {
  state = {
    defaultItems: ['Womens', 'Mens', 'Kids', 'Dogs', 'Cats'],
    url: `http://localhost:8080/api/prefs/${this.props.customerID}`,
    items: []
  }
  // loadPrefsFromServer
  loadPrefsFromServer(){
    axios.get(this.state.url)
      .then(res => {
        if(res.data.preferences) {
          this.setState({
            items: res.data.preferences
          })
        } else {
          this.setState({
            items: this.state.defaultItems
          })
        }
      }).catch(err => {
        console.error(err);
      });
  }
  // handlePrefsUpdate
  handlePrefsUpdate() {

  }
  // hanldePrefsSubmit
  handlePrefsSubmit () {

  }

  componentDidMount () {
    this.loadPrefsFromServer();
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
        items: arrayMove(this.state.items, oldIndex, newIndex)
    });
    axios.put(this.state.url, {
      "preferences": this.state.items
    });
  }

  render() {
    return(
      <SortablePreferences
        items = {this.state.items}
        onSortEnd = {this.onSortEnd}
      />
    )
  }
}

PreferenceCenter.propTypes = {
  customerID: React.PropTypes.number
}

PreferenceCenter.defaultProps = {
  message: 'Hello!'
}

export default PreferenceCenter;
