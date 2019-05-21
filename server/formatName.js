function formatName(name) {
  const lowerCase = name.toLowerCase();
  const upperCase = name.toUpperCase();
  const firstCap = name[0].toUpperCase() + name.slice(1).toLowerCase();
  return [lowerCase, upperCase, firstCap];
}

module.exports = formatName;