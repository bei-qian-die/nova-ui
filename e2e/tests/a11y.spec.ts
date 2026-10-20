import { expect, test } from '@playwright/test'

// 无障碍 & 键盘导航（面试考点 #5）
test.describe('键盘导航与无障碍', () => {
  test('Switch 支持 Space 切换', async ({ page }) => {
    await page.goto('/')
    const el = page.locator('[role="switch"]').first()
    await el.focus()
    const before = await el.getAttribute('aria-checked')
    await page.keyboard.press('Space')
    const after = await el.getAttribute('aria-checked')
    expect(after).not.toBe(before)
  })

  test('Modal 具备 dialog 语义与 aria-modal', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '打开对话框' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  test('Modal 焦点被困在面板内（连续 Tab 不穿出）', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '打开对话框' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    // 连续 Tab 多次，焦点始终停留在 dialog 内部（焦点陷阱的边界循环）
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab')
      const inDialog = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]')
        return dialog ? dialog.contains(document.activeElement) : false
      })
      expect(inDialog).toBe(true)
    }
  })

  test('Modal 支持 Esc 关闭', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: '打开对话框' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('Modal 关闭后焦点归还到触发按钮', async ({ page }) => {
    await page.goto('/')
    const trigger = page.getByRole('button', { name: '打开对话框' })
    await trigger.click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('Tabs 支持左右方向键切换', async ({ page }) => {
    await page.goto('/')
    const tabs = page.locator('[role="tab"]')
    if ((await tabs.count()) < 2) return
    await tabs.first().focus()
    await page.keyboard.press('ArrowRight')
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
  })
})