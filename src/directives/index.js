export const imgerror = {
  inserted(el, binding, enode) {
    // console.log(el)
    // console.log(binding)
    // console.log(enode)
    el.onerror = function() {
      el.src = binding.value
    }
  }
}
