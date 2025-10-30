import { test, expect } from '@playwright/test';

const { chromium } = require('playwright');

test('politics_course', async () => {
  test.setTimeout(10000000);
  const userDataDir = 'C:\\Users\\23959\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default';
  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'msedge',
    headless: false
  });
  let page = await context.newPage();
  
  // let log_num = 0;
  // await page.waitForURL('load');
  let course_finished

  do {
    await page.goto('https://nbuyjs.yuketang.cn/pro/lms/CSs3mnBmJ7Y/28403852/studycontent');
    const newPagePromise = context.waitForEvent('page');
    let course_item = await page.locator('.section-list>.content').filter({hasNot:page.getByText('已完成').filter({visible:true})}).first()

    await course_item.click();

    let newpage = await newPagePromise;
    console.log('当前页面：',await course_item.locator('.title').innerText())
    page.close();
    page=newpage;
    course_finished = true;
    await page.waitForLoadState('networkidle')
    
    let course_name = await page.locator('.title-fl').innerText()
    let state = await page.locator('.xt_video_player_controls_inner')
    if (await state.locator('.xt_video_player_volume_value').innerText() !== '0%') {
      await state.locator('.xt_video_player_common_icon ').click()
    }
    let total_time = await state.locator('.xt_video_player_current_time_display>span:nth-child(2)').innerText();

    total_time = timeToNum(total_time)
    let current_time
    do {
      let btstate = await state.locator('.play-btn-tip').innerText()
      current_time = await state.locator('.xt_video_player_current_time_display>span:nth-child(1)').innerText()
      current_time = timeToNum(current_time)

      if (btstate === '播放') {
        await state.locator('.xt_video_player_play_btn').click()
      }
      await page.waitForTimeout(5000)
      console.log(current_time, total_time, course_name)
      //   let interval = Date.now()
      //   interval = Math.floor(interval / 1000)
      //   if (interval % 10 === 0 && log_num === 0) {
      //     console.log(current_time, total_time)
      //     log_num++;
      //   } else if (interval % 10 !== 0) {
      //     log_num = 0
      //   }
    } while (current_time < total_time)
    
  } while (course_finished)




  await context.close();
  /**
     * @param {string} timestr
     */
  function timeToNum(timestr) {


    const [hour, minute, second] = String(timestr).split(':');
    const [hournum, minutenum, secondnum] = [Number(hour), Number(minute), Number(second)];
    return hournum * 60 * 60 + minutenum * 60 + secondnum;
  }
})