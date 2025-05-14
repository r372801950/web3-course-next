import {User} from "@/app/[locale]/list/user";

export default function UserCard({user}:{user:User}) {
  return (
    <div key={user.id} className="border p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p>名字: {user.name} ETH</p>
    </div>
  )
}