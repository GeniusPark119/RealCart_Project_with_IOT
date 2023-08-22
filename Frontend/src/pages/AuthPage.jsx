import queryString from "query-string";

function AuthPage() {
  const qs = queryString.parse(window.location.search);
  window.location.href = "/";
  console.log(document);
  console.log(window.location.href);
  console.log(qs.token);
  localStorage.setItem("access-token", qs.token);
}

export default AuthPage;
