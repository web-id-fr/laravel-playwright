import { test, expect } from '@playwright/test'
import { create, currentUser, login, logout, php, refreshDatabase } from './laravel-helpers'

test('Can create a new user and log them in', async ({ page }) => {
    const user1 = await login({ page })
    expect(user1.name).toBeDefined()
    const user2 = await login({ page, attributes: { email: 'yoann@web-id.fr' } })
    expect(user2.name).toEqual('Yoann')
    const user3 = await login({
        page,
        attributes: { email: 'new@user.fr', name: 'New user' },
    })
    expect(user3.email).toEqual('new@user.fr')
})

test('Can logout the current user', async ({ page }) => {
    await login({ page })
    const userBefore = await currentUser({ page })
    expect(userBefore.name).toBeDefined()
    await logout({ page })
    const userAfter = await currentUser({ page })
    expect(userAfter).toBeNull()
})

test.only('Can execute arbitrary PHP', async ({ page }) => {
    await refreshDatabase({ page, parameters: { '--seed': true } })
    const sum = await php({ page, command: '2+2' })
    expect(sum).toEqual(4)
    const userCount = await php({ page, command: 'App\\Models\\User::count()' })
    expect(userCount).toEqual(1)
    await page.pause()
    await create({ page, model: 'App\\Models\\User', count: 2 })
    const userCountCreated = await php({
        page,
        command: 'App\\Models\\User::count()',
    })
    expect(userCountCreated).toEqual(3)
})
