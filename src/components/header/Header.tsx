import { Container, LogoutBtn } from "../index.ts";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
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

            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
