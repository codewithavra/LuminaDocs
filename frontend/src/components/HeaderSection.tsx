

const HeaderSection = ({title}:{title : string | null}) => {
  return (
    <div className='h-10 fixed top-0 left-0 right-0 flex justify-center items-center bg-background w-svw z-40'>{title===null ? "new chat" : title}</div>
  )
}

export default HeaderSection