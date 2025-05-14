'use client';
import React, {useState} from "react";
import {createUsers} from "@/app/[locale]/list/user";
import {Virtuoso} from "react-virtuoso";
import UserCard from "@/app/[locale]/list/user-card";

export default function VirtualList() {
  const [users] = useState(createUsers());

  return (
    <div>
      {/*{*/}
      {/*  users.map((user) => (*/}
      {/*    <div key={user.id} className="border p-4 rounded-lg shadow">*/}
      {/*      <h2 className="text-xl font-bold">{user.name}</h2>*/}
      {/*      <p>名字: {user.name} ETH</p>*/}
      {/*    </div>*/}
      {/*  ))*/}
      {/*}*/}
      <Virtuoso data={users} className='!h-[400px]' itemContent={(_,user) => <UserCard user={user} />} />
    </div>
  )

};