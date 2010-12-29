
from docutils.parsers.rst import Directive
from docutils.parsers.rst import states, directives
from docutils.parsers.rst.directives import admonitions
from docutils import languages
from docutils import nodes

class todo(nodes.Admonition, nodes.Element): pass

class todoAdmonition(admonitions.BaseAdmonition):
    node_class = todo

language = languages.get_language("en")
language.labels["todo"] = "To Do"

directives.register_directive("todo", todoAdmonition)

