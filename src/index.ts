// @ts-nocheck

import {Command, flags} from '@oclif/command'
import * as puppeteer from 'puppeteer'

const sleep = (waitTimeInMs: number) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

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
    const page = await browser.newPage();
    await page.goto('https://facebook.com');
    await sleep(20000);

    await page.goto('https://www.facebook.com/me/photos_of/', {waitUntil: "networkidle0"});

    // await sleep(10000);
    // let linksNL = await page.$$('a');
    let firstPhoto = await page.$$eval('a', links => links.find(link => link.href.startsWith("https://www.facebook.com/photo.php?fbid")).href)
    // let links = Array.from(linksNL);
    // console.log('LINKS:', links);
    // let firstPhoto = links.find(link => link.href.startsWith("https://www.facebook.com/photo.php?fbid")).href
    console.log('FIRST PHOTO:', firstPhoto);

    await page.goto(firstPhoto, {waitUntil: "networkidle0"});

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
