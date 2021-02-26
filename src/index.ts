// @ts-nocheck

import {Command, flags} from '@oclif/command'
import * as puppeteer from 'puppeteer'
import {URL} from 'url';

const sleep = (waitTimeInMs: number) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

function parsePhotoID(photoURL: string): string {
  const pURL = new URL(photoURL);
  return pURL.searchParams.get('fbid');
}

async function downloadPhotos(page: puppeteer.Page, photoURL: string): void {
  const photoID = parsePhotoID(photoURL)
  console.log('PHOTO ID:', photoID);

  // await page.goto(photoURL, {waitUntil: "networkidle0"});
  setTimeout(() => {
    console.log('GOTO URL')
    page.goto(photoURL)
  }, 1000); // Delete the page.goto so that the page.waitForResponse has time to start properly
  console.log('WAIT FOR RESPONSE')
  const photoResponse = await page.waitForResponse((response: puppeteer.HTTPResponse) => {
    // console.log('R URL:', response.url());
    const headers = response.headers();
    const contentID = headers['x-content-id'];
    const contentType = headers['content-type'];

    if (contentType === 'image/jpeg') {
      console.log('CONTENT ID:', contentID);
      if (contentID.slice(0,12) === photoID.slice(0,12)) {
        // console.log('RESPONSE HEADERS:', headers)
        // console.log('RESPONSE URL:', response.url());
        return true;
      }
    }

    return false;
    // response.headers()['x-conent-id'] === photoID && response.status() === 200);
  });

  console.log('PHOTO URL:', photoResponse.url());

  let nextPhotoURL = await page.$$eval('div', divs => divs.find(div => div.role === 'button' && div['aria-label'] === "Next photo"));
  console.log('NEXT PHOTO:', nextPhotoURL);
  // await page.on('response', response => {
  //   const headers = response.headers();
  //   if (headers['x-content-id']) {
  //     console.log('RESPONSE HEADERS:', headers)
  //     console.log('RESPONSE URL:', response.url());
  //   }
  // })
  return
}

class FbPhotoDownloader extends Command {
  static description = 'Downloads your tagged photos from Facebook'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(FbPhotoDownloader)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from ./src/index.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: {
        width: 1270,
        height: 720,
      }
    });
    const context = await browser.createIncognitoBrowserContext();
    // Create a new page in a pristine context.
    const page = await context.newPage();
    // const page = await browser.newPage();
    await page.goto('https://facebook.com');
    await sleep(20000);

    await page.goto('https://www.facebook.com/me/photos_of/', {waitUntil: "networkidle0"});

    // await sleep(10000);
    // let linksNL = await page.$$('a');
    let firstPhotoUrl = await page.$$eval('a', links => links.find(link => link.href.startsWith("https://www.facebook.com/photo.php?fbid")).href)
    // let links = Array.from(linksNL);
    // console.log('LINKS:', links);
    // let firstPhoto = links.find(link => link.href.startsWith("https://www.facebook.com/photo.php?fbid")).href
    console.log('FIRST PHOTO:', firstPhotoUrl);

    await downloadPhotos(page, firstPhotoUrl)


    // const headers = response.headers();
    // console.log(headers);

    // await page.on('domcontentloaded', async () => {
    //   let links = await page.$$('a');
    //   console.log('LINKS:', links);
    // })



    browser.on('targetdestroyed', async () => {
      await browser.close();
    })
  }
}

export = FbPhotoDownloader
