import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  return (
    <nav className="menu">
      <ul>
        <li>
          <Link to="/register">Регистрация</Link>
        </li>

        <li>
          <Link to="/login">Вход</Link>
        </li>

        <li>
          <Link to="/profile">Личный кабинет</Link>
        </li>
      </ul>
    </nav>
  );
}