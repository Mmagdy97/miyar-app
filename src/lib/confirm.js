// Promise-based in-app confirm dialog (replaces window.confirm). Rendered by <ConfirmHost/>.
let open = null;
export const bindConfirm = (fn) => { open = fn; return () => { if (open === fn) open = null; }; };
/** askConfirm("Delete?", { yes: "حذف", danger: true }) -> Promise<boolean> */
export const askConfirm = (message, opts = {}) => (open ? open(message, opts) : Promise.resolve(window.confirm(message)));
