import Actions from "./components/Actions";
import Container from "./components/Container";
import Content from "./components/Content";
import Description from "./components/Description";
import Header from "./components/Header";

const Modal = Object.assign(Container, {
  Header,
  Content,
  Description,
  Actions,
});

export default Modal;
