const infoPages = [
  { name: "How EZH Works", href: "/info/how-ezh-works" },
  { name: "Co-op vs Producer", href: "/info/co-op-vs-producer" },
  { name: "Privacy Policy", href: "/info/privacy-policy" },
];

const formattedInfoPages = infoPages.map((infoPage) => ({
  value: infoPage.name,
  label: infoPage.name,
  href: infoPage.href,
}));

const useInfoPages = () => {
  const getAll = () => formattedInfoPages;

  const getByValue = (value: string) => {
    return formattedInfoPages.find((item) => item.value === value);
  };

  return {
    getAll,
    getByValue,
  };
};

export default useInfoPages;
