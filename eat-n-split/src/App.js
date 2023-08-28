import "./index.css";
import React, { useState } from "react";
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
  const [addfriend, setaddfriend] = useState(false);
  const [friends, setfriends] = useState(initialFriends);
  const [selectedFriend, setselectedFriend] = useState(null);
  function handleaddfriend() {
    setaddfriend((show) => !show);
    console.log(addfriend);
  }
  function handleaddFriendlist(friend) {
    setfriends((friends) => [...friends, friend]);
    setaddfriend(false);
  }
  function handleselection(friend) {
    setselectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setaddfriend(false);
  }
  function handleSplitbill(value) {
    console.log(value);
    setfriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setselectedFriend(null); //disappearing the split bill form
  }
  return (
    <div className="App">
      <div className="sidebar">
        <Friendlist
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleselection}
        />
        {addfriend && <FormAddFriend onAddfriends={handleaddFriendlist} />}
        <Button onClick={handleaddfriend}>
          {addfriend ? "Close" : "Add Friends"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitbill}
        />
      )}
    </div>
  );
}
function Friendlist({ friends, onSelection, selectedFriend }) {
  //const friends = initialFriends;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You Owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} both are Even.</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function FormAddFriend({ onAddfriends }) {
  const [name, setname] = useState("");
  const [image, setimage] = useState("https://i.pravatar.cc/48");
  //const [addfriends, setaddfriends] = useState([]);
  function handlesubmit(e) {
    e.preventDefault();
    if (!name || !image) {
      return;
    }
    const id = crypto.randomUUID();
    const description = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddfriends(description);
    setname("");
    setimage("https://i.pravatar.cc/48");
    //console.log(description);
    //setaddfriends((para) => [...para, description]);
  }

  return (
    <form onSubmit={handlesubmit} className="form-add-friend">
      <label>👩‍👧‍👦 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setname(e.target.value)}
      />
      <label>🖼️ Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setimage(e.target.value)}
      />
      <Button>Add</Button>
      {/*addfriends.map((friends) => (
        <div>
          <li>{friends.name}</li>
          <img src={friends.image} alt={friends.name} />
        </div>
      ))*/}
    </form>
  );
}
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setbill] = useState("");
  const [paidbyuser, setpaidbyuser] = useState("");
  const paidByFriend = bill ? bill - paidbyuser : "";
  const [whoIsPaying, setwhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidbyuser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidbyuser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a Bill with {selectedFriend.name}</h2>
      <label>💵 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setbill(Number(e.target.value))}
      />
      <label>🧍 Your Expense</label>
      <input
        type="text"
        value={paidbyuser}
        onChange={(e) =>
          setpaidbyuser(
            Number(e.target.value) > bill ? paidbyuser : Number(e.target.value)
          )
        }
      />
      <label>🧑‍🤝‍🧑 {selectedFriend.name}'s Expense</label>
      <input type="text" value={paidByFriend} disabled />
      <label>🧍who is Paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setwhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
