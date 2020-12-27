/**
 *
 * Here reside all functions of the PopUp page
 */

const second_number = document.querySelector('#second-number')
const first_number = document.querySelector('#first-number')
const submitBtn = document.querySelector('#pr')

const samePageBtn = document.querySelector('#same-page')
const allPageBtn = document.querySelector('#all-pages')
const tab1 = document.querySelector('#tab1')
const tab2 = document.querySelector('#tab2')
const refundReason = document.querySelector('#refund-reason')

const warningText = document.querySelector('#warning-text')
function changePage(e) {
  if (e.target.id == 'same-page') {
    allPageBtn.classList.remove('badge-secondary')
    allPageBtn.classList.add('badge-light')
    samePageBtn.classList.add('badge-secondary')
    samePageBtn.classList.remove('badge-light')
    tab1.classList.remove('d-none')
    tab2.classList.add('d-none')
  } else {
    allPageBtn.classList.add('badge-secondary')
    allPageBtn.classList.remove('badge-light')
    samePageBtn.classList.remove('badge-secondary')
    samePageBtn.classList.add('badge-light')
    tab1.classList.add('d-none')
    tab2.classList.remove('d-none')
  }
}
samePageBtn.addEventListener('click', changePage)
allPageBtn.addEventListener('click', changePage)

submitBtn.addEventListener('click', function () {
  let firstNum = first_number.value
  let secondNum = second_number.value
  let reason = refundReason.value

  if (
    !firstNum ||
    !secondNum ||
    reason == 'none' ||
    firstNum.length < 8 ||
    secondNum.length < 8
  ) {
    warningText.classList.remove('d-none')
  } else {
    submitBtn.innerText = 'Refunding...'
    submitBtn.style.disabled = true
    submitBtn.classList.add('disabled')

    warningText.classList.add('d-none')
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          isFor: 'content_script:range_process',
          firstNum,
          secondNum,
          reason,
        },
        (res) => {
          submitBtn.innerText = 'Refund'
          submitBtn.style.disabled = false
          submitBtn.classList.remove('disabled')
          first_number.value = ''
          second_number.value = ''
          refundReason.value = ''
          if (res.status) window.close()
        }
      )
    })
  }
})
const pageIsOrderPage = (url) => {
  const requirements = ['tophatter.com/admin', 'users', 'invoices']
  return requirements.every((requirement) => {
    return url.includes(requirement)
  })
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var currTab = tabs[0]
  if (currTab) {
    if (pageIsOrderPage(currTab.url.toString())) {
      allPageBtn.classList.remove('badge-secondary')
      allPageBtn.classList.add('badge-light')
      samePageBtn.classList.add('badge-secondary')
      samePageBtn.classList.remove('badge-light')
      tab1.classList.remove('d-none')
      tab2.classList.add('d-none')
    } else {
      allPageBtn.classList.add('badge-secondary')
      allPageBtn.classList.remove('badge-light')
      samePageBtn.classList.remove('badge-secondary')
      samePageBtn.classList.add('badge-light')
      tab1.classList.add('d-none')
      tab2.classList.remove('d-none')
      samePageBtn.classList.add('disable')
      samePageBtn.style.disabled = true
    }
  }
})
