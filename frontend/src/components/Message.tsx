const Message = ({
  role,
  content,
}: {
  role: "user" | "assistant"
  content: string
}) => {
  return <div className={`h-fit w-full p-3 text-foreground ${role==="user"? 'rounded-tl-2xl bg-green-600/80 ml-auto' : 'rounded-tr-2xl bg-card mr-auto'} rounded-b-2xl border`}>
    <p>{content}</p>
  </div>
}

export default Message
