/**
 *
 * All the logic of going on a page and do action on that page.
 */

// Dependencies
let puppeteer = require('puppeteer')
// Custom dependencies
const config = require('./config')
const credentials = require('./.env')
const helper = require('./helper')

let { allActionsMatch, constants } = helper

// The main Object and the one to return from this module.
const scrawler = {
  browser: null,
  page: null,
}

scrawler.init = async () => {
  if (scrawler.browser == null)
    scrawler.browser = await puppeteer.launch(config.browser)
  if (scrawler.page == null) scrawler.page = await scrawler.browser.newPage()
}
scrawler.login = async () => {
  const { LOGIN_PAGE } = constants
  await scrawler.init()
  await scrawler.page.goto(LOGIN_PAGE)
  await scrawler.page.waitForSelector('.btn-google')
  await scrawler.page.click('.btn-google')
  //await scrawler.page.waitForNavigation()
  let pages = await scrawler.browser.pages()
  //console.log({pages})
  pages.forEach((page) => console.log({ url: page.url() }))
  //await lastPage.type('#identifierId', 'hey')
}

scrawler.goToPage = async (link) => {
  if (!scrawler.loggedIn) {
    await scrawler.login()
  }
  if (
    typeof link === 'string' &&
    link.trim().length > 0 &&
    link.includes('http')
  )
    await scrawler.page.goto(link)
  else throw new TypeError('The Link must be a string')
}
scrawler.getOrderDetails = () => {}
//part, match
scrawler.actionOnPage = async (link, actions) => {
  const takeAction = async (link, actions) => {
    await scrawler.goToPage(link)
    // Creating an order object containing  all details on the order
    let orderDetails = await scrawler.getOrderDetails()

    if (allActionsMatch(orderDetails, action)) {
      //take actions
      let handleFunction =
        typeof scrawler[action.main_action] == 'function'
          ? scrawler[action.main_action]
          : false

      if (handleFunction) await handleFunction()
      else
        throw new Error(
          `There is no defined function for ${action.main_action} `
        )
    }
  }
  if (Array.isArray(link) && links.length > 0) {
    for (let orderLink of link) {
      await takeAction(orderLink, actions)
    }
  } else if (
    typeof link === 'string' &&
    link.trim().length > 0 &&
    link.includes('https')
  ) {
    await takeAction(link, actions)
  } else {
    throw TypeError('link must either an array of string or a string')
  }
}

async function test() {
  console.log('Initializing')
  await scrawler.login()
  console.log('set up ')
}
test()
module.exports = scrawler
