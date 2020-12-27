console.log({ location: window.location.href })

const pageIsOrderPage = () => {
  const requirements = ['users', 'invoices']
  return requirements.every((requirement) => {
    return window.location.href.includes(requirement)
  })
}
const getOrderList = () => {
  if (pageIsOrderPage()) {
    let orders = []
    const orderTableRows = document.querySelectorAll(
      'table.table.table-striped > tbody >tr'
    )
    for (let tableRow of orderTableRows) {
      let secondTd = tableRow.querySelector('td').nextElementSibling
      if (secondTd) {
        let secondDiv = secondTd.querySelector('div').nextElementSibling
        let anchorTags = secondDiv.querySelector('span').querySelector('a')
          .nextElementSibling
        const url = anchorTags.href
        const urlArray = url.split('/')
        const number = urlArray[urlArray.length - 1]
        orders.push({ number, url })
      }
    }
    return orders
  } else return false
}
function alertDone(status) {
  let box = document.createElement('div')
  box.innerText = status ? 'Done' : 'Failed'
  box.style.position = 'fixed'
  box.style.top = 0
  box.style.left = 0
  box.style.background = 'black'
  box.style.color = 'white'
  box.style.padding = '10rem'
  document.body.appendChild(box)
}
const ordersWeWillWorkWith = (buyerOrders, fullRange) => {
  let filteredOrder = []
  fullRange.forEach((orderNum, idx) => {
    // if (buyerOrders.some((ord) => ord.number == order))
    let order = buyerOrders.find((ord) => ord.number == orderNum)
    if (order) filteredOrder.push(order)
  })
  return filteredOrder
}
const getTheRange = (startRange, endRange) => {
  //Create the range object
  let fullRange = []
  for (
    let currentRange = startRange;
    currentRange < endRange + 1;
    currentRange++
  )
    fullRange.push(currentRange)

  return fullRange
}

//Act on orders
const refundOrderList = (startRange, endRange, reason) => {
  console.log(' IN this ')
  let range = getTheRange(+startRange, +endRange)
  //range = [127314367, 127314369]
  console.log({ range })
  if (pageIsOrderPage()) {
    console.log('On right page')
    let orders = []
    const orderTableRows = document.querySelectorAll(
      'table.table.table-striped > tbody >tr'
    )
    for (let tableRow of orderTableRows) {
      let secondTd = tableRow.querySelector('td').nextElementSibling
      if (secondTd) {
        let secondDiv = secondTd.querySelector('div').nextElementSibling
        let anchorTags = secondDiv.querySelector('span').querySelector('a')
          .nextElementSibling
        const url = anchorTags.href
        const urlArray = url.split('/')
        const number = urlArray[urlArray.length - 1]

        if (range.some((num) => num == number)) {
          console.log({ number, h: 'in list' })
          let actionBtn = tableRow.querySelector('.dropdown')
          let refundBtn = actionBtn.querySelector('.dropdown-item.refund')

          if (refundBtn) {
            refundBtn.click()
            let select = document.querySelector('#refund-reason-type')
            // let options = select.childNodes()
            // console.log({ options })
            let options = select.querySelectorAll('option')
            let refundReason = null

            for (let option of options) {
              console.log(option.value)
              if (option.value == 'account_takeover') {
                //console.log({ option, m: 'found' })
                refundReason = option
                break
              }
            }
            select.value = reason
            const summitBtn = document.querySelector('#refund-issue')
            const form = document.querySelector('form#refund')

            console.log({ form })
            //form.submit()

            //console.log({ refundReason })
            if (refundReason) refundReason.click()
          }
        }
        orders.push({ number, url })
      }
    }

    return true
  } else {
    console.log('Issue not found')

    return false
  }
}
//refundOrderList(127314367, 127314369)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.isFor === 'content_script:range_process') {
    const { firstNum, secondNum, reason } = request

    let status = refundOrderList(firstNum, secondNum, reason)
    alertDone(status)
    sendResponse({ status })
  }
})
