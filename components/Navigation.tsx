import {ImStatsBars} from 'react-icons/im'

function Nav() {
  return (
    <header className='container max-w-[2xl] px-6 py-6 mx-auto'>
    <div className="flex justify-between">
    <div className="flex items-center gap-2">
      <img 
      className="h-[40px] w-[40px] rounded-full overflow-hidden"
      src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      
      />
      <small>Hello world</small>
    </div>
    <nav className="flex items-center gap-1">
      <div className='text-2xl'><ImStatsBars/></div>
      <div><button className='btn btn-danger'>Sign Out</button></div>
    </nav>
    </div>
   </header>
  )
}

export default Nav