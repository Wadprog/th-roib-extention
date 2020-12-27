

console.log('bg.js')
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'performance:metric') {
    const tab = sender.tab.url.toString()
    console.log({ tab })
  }
  if (request.isFor === 'background_script:isThisOrderPage') {
    console.log('BG received request ')

    const url = sender.tab.url.toString()
    console.log({ url })
    console.log({ re: pageIsOrderPage(url) })
    sendResponse({ val: pageIsOrderPage(url) })
  }
})
