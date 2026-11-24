import { useEffect, useState, type MouseEvent } from "react"
import About from "./design/About"
import Clarinet from "./design/Clarinet"
import Contact from "./design/Contact"
import Curious from "./design/Curious"
import Home from "./design/Home"
import Macktex from "./design/Macktex"
import Victorious from "./design/Victorious"

const pages = {
  home: Home,
  about: About,
  contact: Contact,
  curious: Curious,
  victorious: Victorious,
  clarinet: Clarinet,
  macktex: Macktex,
} as const

type Page = keyof typeof pages

function pageFromHash(): Page {
  const page = window.location.hash.slice(1) as Page
  return page in pages ? page : "home"
}

export default function App() {
  const [page, setPage] = useState<Page>(pageFromHash)
  const Page = pages[page]

  useEffect(() => {
    const updatePage = () => {
      setPage(pageFromHash())
      window.scrollTo(0, 0)
    }

    window.addEventListener("hashchange", updatePage)
    return () => window.removeEventListener("hashchange", updatePage)
  }, [])

  const navigate = (nextPage: Page) => {
    if (page === nextPage) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    window.location.hash = nextPage
  }

  const handleNavigation = (event: MouseEvent<HTMLDivElement>) => {
    const control = (event.target as HTMLElement).closest(
      "a, button, [data-name='Frame']",
    )
    if (!control || (control instanceof HTMLAnchorElement && control.href))
      return

    const name = control.getAttribute("data-name") ?? ""
    const label = control.textContent?.trim().replace(/\s+/g, " ") ?? ""

    if (name.includes("Curious Connection")) return navigate("curious")
    if (name.includes("Victorious")) return navigate("victorious")
    if (name.includes("CL Project")) return navigate("clarinet")
    if (name.includes("Macktex Project")) return navigate("macktex")
    if (label.includes("← Back")) return navigate("home")
    if (label === "Home") return navigate("home")
    if (label === "About") return navigate("about")
    if (label === "Contact") return navigate("contact")

    if (label === "Projects" || label === "See My Work") {
      if (page !== "home") {
        window.location.hash = "home"
        window.setTimeout(
          () =>
            document
              .querySelector('[data-name="selected-work"]')
              ?.scrollIntoView({ behavior: "smooth" }),
          50,
        )
      } else {
        document
          .querySelector('[data-name="selected-work"]')
          ?.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const pageClass = ["curious", "victorious", "clarinet", "macktex"].includes(page)
    ? "case-study"
    : `page-${page}`

  return (
    <div className={`site ${pageClass}`} onClick={handleNavigation}>
      <Page />
    </div>
  )
}