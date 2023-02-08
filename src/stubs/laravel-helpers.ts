import { Page } from '@playwright/test'

export type CsrfTokenProps = {
    page: Page
}

export async function csrfToken({ page }: CsrfTokenProps) {
    const response = await page.request.get('/__playwright__/csrf_token', { headers: { Accept: 'application/json' } })
    return await response.json()
}

export type LoginProps = {
    page: Page
    attributes?: object
}

/**
 * Create a new user and log them in.
 *
 * @example login({page})
 *          login({page, attributes: {email: 'yoann@web-id.fr'}})
 *          login({page, attributes: {email: 'new@user.fr', name: 'New user'}})
 */
export async function login({ page, attributes }: LoginProps) {
    const token = await csrfToken({ page })

    const response = await page.request.post('/__playwright__/login', {
        headers: { Accept: 'application/json' },
        data: {
            _token: token,
            attributes,
        },
    })
    return await response.json()
}

export type CurrentUserProps = {
    page: Page
}

/**
 * Fetch the currently authenticated user object.
 *
 * @example currentUser({page})
 */
export async function currentUser({ page }: CurrentUserProps) {
    const token = await csrfToken({ page })
    const response = await page.request.post('/__playwright__/current-user', {
        headers: { Accept: 'application/json' },
        data: { _token: token },
    })
    const body = await response.text()
    if (!body) {
        console.log('No authenticated user found.')
        return null
    }
    return await response.json()
}

export type LogoutProps = {
    page: Page
}

/**
 * Logout the current user.
 *
 * @example logout({page})
 */
export async function logout({ page }: LogoutProps) {
    const token = await csrfToken({ page })
    const response = await page.request.post('/__playwright__/logout', {
        headers: { Accept: 'application/json' },
        data: { _token: token },
    })
    console.log(await response.text())
    return await response.text()
}

export type CreateProps = {
    page: Page
    model: string
    count?: number
    attributes?: object
    load?: string[]
    state?: string[]
}

/**
 * Create a new Eloquent factory.
 *
 * @param {String} model
 * @param {Number|null} times
 * @param {Object} attributes
 *
 * @example create({page, model: 'App\\Models\\User'});
 *          create({page, model: 'App\\Models\\User', count: 2});
 *          create({page, model: 'App\\Models\\User', attributes: { active: false }});
 *          create({page, model: 'App\\Models\\User', count: 2, attributes: { active: false }});
 *          create({page, model: 'App\\Models\\User', count: 2, attributes: { active: false }, load: ['profile']});
 *          create({page, model: 'App\\Models\\User', count: 2, attributes: { active: false }, load: ['profile'], state: ['guest']});
 *          create({page, model: 'App\\Models\\User', attributes: { active: false }, load: ['profile']);
 *          create({page, model: 'App\\Models\\User', attributes: { active: false }, load: ['profile'], ['guest']);
 *          create({page, model: 'App\\Models\\User', load: ['profile']});
 *          create({page, model: 'App\\Models\\User', load: ['profile'], state: ['guest']});
 */
export async function create({ page, model, count = 1, attributes = {}, load = [], state = [] }: CreateProps) {
    const token = await csrfToken({ page })
    const response = await page.request.post('/__playwright__/factory', {
        headers: { Accept: 'application/json' },
        data: { _token: token, model, count, attributes, load, state },
    })
    return await response.json()
}

export type ArtisanProps = {
    page: Page
    command: string
    parameters: object
}

/**
 * Trigger an Artisan command.
 *
 * @example artisan({page, command: 'cache:clear'});
 */
export async function artisan({ page, command, parameters = {} }: ArtisanProps) {
    const token = await csrfToken({ page })
    console.log(
        [
            command,
            Object.entries(parameters)
                .map(([k, v]) => `${k}="${v}"`)
                .join(' '),
        ].join(' ')
    )
    return await page.request.post('/__playwright__/artisan', {
        headers: { Accept: 'application/json' },
        data: { _token: token, command, parameters },
    })
}

export type RefreshDatabaseProps = {
    page: Page
    parameters?: object
}

/**
 * Refresh the database state.
 **
 * @example refreshDatabase({page});
 *          refreshDatabase({page, parameters: {'--drop-views': true}});
 */
export async function refreshDatabase({ page, parameters = {} }: RefreshDatabaseProps) {
    return await artisan({ page, command: 'migrate:fresh', parameters })
}

export type SeedProps = {
    page: Page
    seederClass?: string
}

/**
 * Seed the database.
 *
 * @example seed({page});
 *          seed({page, seederClass: 'PlansTableSeeder'});
 */
export async function seed({ page, seederClass = '' }: SeedProps) {
    const parameters = {}

    if (seederClass) {
        parameters['--class'] = seederClass
    }
    return await artisan({ page, command: 'db:seed', parameters })
}

export type PhpProps = {
    page: Page
    command: string
}

/**
 * Execute arbitrary PHP.
 *
 *
 * @example php({page, command: '2 + 2'})
 *          php({page, command: 'App\\Model\\User::count()'})
 */
export async function php({ page, command }: PhpProps) {
    const token = await csrfToken({ page })
    const response = await page.request.post('/__playwright__/run-php', {
        headers: { Accept: 'application/json' },
        data: { _token: token, command },
    })
    const json = await response.json()
    return json.result ?? json
}
