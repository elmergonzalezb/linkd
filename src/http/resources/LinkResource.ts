import { Drash } from '../../deps.ts'
import config from "../../config.ts";
import { Link } from "../../Link.ts"

export class LinkResource extends Drash.Http.Resource {
    static paths = ["/link"]

    public async PUT() {
        let full = this.request.getBodyParam('link')
        let short = this.request.getBodyParam('short')
        if (!full) throw new Drash.Exceptions.HttpException(400, "This resource requires the `link` body parameter")
        if (!short) short = Math.random().toString(36).substring(7)

        let link = new Link(short, full)
        return await config.datastore.addLink(link).then(() => {
            this.response.body = link
            return this.response
        }).catch((err) => {
            throw new Drash.Exceptions.HttpException(500, "An error occured while adding")
        })

    }

    public async GET() {
        let short = this.request.getUrlQueryParam("short")

        if (short) {
            this.response.body = await config.datastore.getLinkByShortened(short)
            if(!this.response.body)throw new Drash.Exceptions.HttpException(404, "The requested resource was not found")
        }
        else {
            this.response.body = await config.datastore.getLinks()
        }
        return this.response

    }
}