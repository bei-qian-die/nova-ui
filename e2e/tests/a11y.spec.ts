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
    await page.getByRole('button', { name: '打开弹窗' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
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