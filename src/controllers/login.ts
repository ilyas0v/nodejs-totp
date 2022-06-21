import * as express from 'express'
import * as speakeasy from 'speakeasy'
import * as bcrypt from 'bcryptjs'
import * as Validator from 'validatorjs'
import { Prisma } from '../Prisma'

export const login = async (req: express.Request, res: express.Response) => {
    const rules = {
        email: 'required|email',
        password: 'required|min:8',
        token: 'required|min:6'
    }

    const validation = new Validator(req.body, rules)

    if (validation.fails()) {
        return res.status(422).json(validation.errors)
    }

    const { email, password, token } = req.body

    const user = await Prisma.user.findUnique({
        where: {
            email,
        },
    })

    if(!user) {
        return res.status(422).json({errors: {email: ['No such user']}})
    }

    const checkPassword = bcrypt.compareSync(password, user.password)

    if(!checkPassword) {
        return res.status(422).json({ errors: { password: ['Password is wrong'] } })
    }

    const verified = speakeasy.totp.verify({
        secret: user.secretBase32,
        encoding: 'base32',
        token,
    })

    if(!verified) {
        return res.status(422).json({ errors: { token: ['Token is wrong'] } })
    }

    return res.status(200).json({ success: true })
}
