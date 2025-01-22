import { Container, LogoutBtn } from "../index.ts";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state)=> state.auth.userData);
  console.log(userData);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", slug: "/", active: true },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];





  return (
    <header className="w-full fixed z-10">
      <Container>
        <nav className="flex items-center justify-between shadow-sm bg-slate-900 min-w-full px-6 py-2">
          <div className="">
            <img
              className="h-[4.2rem] rounded-full invert"
              src="/logo.png"
              alt="insipre ink logo"
            />
          </div>
          {/* put search box */}
          <ul className="flex justify-around items-center gap-8 text-white">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button onClick={() => navigate(item.slug)}>
                    {item.name}
                  </button>
                </li>
              ) : null
            )}

            {/* profile Dropdown */}

            {authStatus && <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src={userData?.profilePicURL}
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                 <Link  to={`/users/${userData?.username}`}
                 className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                 > Your profile</Link>
  
                </MenuItem>
                <MenuItem>
                   <ul  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">

                      {authStatus && (
                        <li>
                        <LogoutBtn />
                      </li>
                      )}
  
                    </ul>
                </MenuItem>
              </MenuItems>
            </Menu>}


            
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
