import { WebsiteConfig } from "maishu-admin-scaffold/static/website-config";
let w: WebsiteConfig = {
    requirejs: {
        paths: {
            "maishu-dilu-react": "node_modules/maishu-dilu-react/dist/index"
        }
    },
    menuItems: [
        { id: "EAFBBE1A-1344-4862-8EDC-A0648777C872", path: "#list-page", name: "列表页" },
        { id: "FF36EE21-92AE-4F80-AA9E-F48CA6090DAA", path: "#fixed-header", name: "固定表头" },
        { id: "1D212A98-576E-471A-AB79-78002C70EBB6", path: "#item-name", name: "项名" },
        { id: "CFD29D8F-7499-45B0-9332-01E5A1B4C986", path: "#empty-text", name: "空文字" }
    ]
}

export default w;