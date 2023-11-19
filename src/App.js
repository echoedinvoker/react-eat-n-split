import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [friends, setFriends] = useState(initialFriends)
  const [selectedFriend, setSelectedFriend] = useState(null)

  function handleShowAddFriend() {
    setShowAddFriend(show => !show)
    setSelectedFriend(null)
  }
  function handleAddFriend(friend) {
    setFriends(friends => [...friends, friend])
    setShowAddFriend(false)
  }
  function handleSelection(friend) {
    setSelectedFriend(curr => curr?.id === friend.id ? null : friend)
    setShowAddFriend(false)
  }
  function handleSplitBill(value) {
    setFriends(friends => friends.map(friend => friend.id === selectedFriend.id
      ? { ...friend, balance: friend.balance + value }
      : friend
    ))

    setSelectedFriend(null)
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList friends={friends} selectedFriend={selectedFriend} onSelection={handleSelection} />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add new friend"}
        </Button>
      </div>

      {selectedFriend && <FormSplitBill
        selectedFriend={selectedFriend}
        onSplitBill={handleSplitBill}
        key={selectedFriend.id}
      />}
    </div>
  )
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("")
  const [paidByUser, setPaidByUser] = useState("")
  const paidByFriend = bill - paidByUser
  const [whoIsPaying, setWhoIsPaying] = useState("user")

  function handleSubmit(e) {
    e.preventDefault()

    if (!bill || typeof paidByUser !== "number") return

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser)
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH {selectedFriend.name}</h2>

      <Input options={{ type: "text", value: bill, onChange: e => setBill(+e.target.value) }}>💰 Bill value</Input>
      <Input options={{
        type: "text",
        value: paidByUser,
        onChange: e => setPaidByUser(+e.target.value > bill
          ? paidByUser
          : +e.target.value
        )
      }}>🧍 Your expense</Input>
      <Input options={{ type: "text", disabled: true, value: paidByFriend }}>👫 {selectedFriend.name}'s expense</Input>

      <label>🤑 Who is paying the bill</label>
      <select value={whoIsPaying} onChange={e => setWhoIsPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  )
}

function FriendList({ friends, selectedFriend, onSelection }) {
  return (
    <ul>
      {friends.map(friend => <Friend friend={friend} selectedFriend={selectedFriend} onSelection={onSelection} key={friend.id} />)}
    </ul>
  )
}

function Friend({ friend, selectedFriend, onSelection }) {
  const isSelected = selectedFriend?.id === friend.id

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance > 0 && (
        <p className="green">{friend.name} owes you {friend.balance}€</p>
      )}
      {friend.balance < 0 && (
        <p className="red">You owe {friend.name} {friend.balance}€</p>
      )}
      {friend.balance === 0 && (
        <p>You and {friend.name} are even</p>
      )}

      <Button onClick={() => onSelection(friend)}>{isSelected ? "Close" : "Select"}</Button>
    </li>
  )
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("")
  const [image, setImage] = useState("https://i.pravatar.cc/48")

  function handleAddFriend(e) {
    e.preventDefault()

    if (!name.trim() || !image.trim()) return

    const id = crypto.randomUUID()
    const friend = {
      id, name,
      image: `${image}?u=${id}`,
      balance: 0
    }

    onAddFriend(friend)

    setName("")
    setImage("https://i.pravatar.cc/48")
  }

  return (
    <form className="form-add-friend" onSubmit={handleAddFriend}>
      <Input options={{ type: "text", value: name, onChange: e => setName(e.target.value) }}>👫 Friend name</Input>
      <Input options={{ type: "text", value: image, onChange: e => setImage(e.target.value) }}>🌄 Image URL</Input>

      <Button>Add</Button>
    </form>
  )
}

function Button({ children, onClick }) {
  return <button className="button" onClick={onClick}>{children}</button>
}

function Input({ options, children }) {
  return (
    <>
      <label>{children}</label>
      <input {...options} />
    </>
  )
}

