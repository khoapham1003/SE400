import classNames from "classnames/bind";
import images from "../../../../assets/images";
import { Button, Menu, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind();

function Header() {
  const navigate = useNavigate();

  const getCookie = (cookieName) => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === cookieName) {
        return value;
      }
    }
    return null;
  };

  const isAdmin = () => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      const tokenParts = accessToken.split(".");
      if (tokenParts.length !== 3) {
        throw new Error("Invalid token format");
      }
      const decodedToken = JSON.parse(atob(tokenParts[1]));
      return decodedToken && (decodedToken.role === "admin") === true;
    }
    return false;
  };

  const handleLogout = () => {
    // Xóa accessToken và userid từ cookie
    document.cookie = `accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    document.cookie = `userid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;

    window.location.reload();
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <header className={cx("h_wrapper")}>
      <div className={cx("inner h_log_inner h_inner")}>
        <div
          className={cx("h_logo")}
          onClick={() => {
            navigate("/");
          }}
        >
          <img className="h_logo_image" src={images.logo} alt="WeVibe" />
        </div>
        <div className={cx("h_user_button")}>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button
              block
              icon={<UserOutlined />}
              style={{
                display: "inline",
                boxShadow: "none",
                width: "3rem",
                color: "#127567",
                border: "none",
                fontWeight: "600",
                cursor: "pointer",
                background: "#ffffff",
              }}
            ></Button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}

export default Header;
