"use client"

import { useState, useMemo } from "react"
import { Check, ChevronDown, ChevronRight, Copy, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { docSections } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 shrink-0"
      onClick={handleCopy}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      <span className="sr-only">Copy code</span>
    </Button>
  )
}

export default function DocsPage() {
  const [search, setSearch] = useState("")
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["doc_1"]))

  const filtered = useMemo(() => {
    if (!search) return docSections
    const lower = search.toLowerCase()
    return docSections.filter(
      (s) =>
        s.title.toLowerCase().includes(lower) ||
        s.description.toLowerCase().includes(lower)
    )
  }, [search])

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const languages = ["JavaScript", "Kotlin", "Swift", "REST"]

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Documentation</h1>
        <p className="text-sm text-muted-foreground">
          SDK integration guides and code examples.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search documentation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No documentation found matching your search.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((section) => {
            const isExpanded = expandedIds.has(section.id)
            return (
              <Card key={section.id}>
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggle(section.id)}
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base">{section.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent>
                    <Tabs defaultValue="JavaScript">
                      <TabsList className="w-full justify-start">
                        {languages.map((lang) => (
                          <TabsTrigger key={lang} value={lang} className="text-xs">
                            {lang === "JavaScript" ? "JS" : lang}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {languages.map((lang) => (
                        <TabsContent key={lang} value={lang}>
                          <div className="relative rounded-md border border-border bg-muted">
                            <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
                              <span className="text-xs font-mono text-muted-foreground">
                                {lang}
                              </span>
                              <CopyButton text={section.content[lang] || ""} />
                            </div>
                            <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
                              <code className={cn("text-foreground font-mono whitespace-pre")}>
                                {section.content[lang] || "No example available."}
                              </code>
                            </pre>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
