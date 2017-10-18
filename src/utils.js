// for nested proptypes
export const lazyFunction = f => ((...args) => f().apply(this, args));

export const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
