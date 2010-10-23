
REST = advanced.rst broccoli.rst brocontrol.rst cluster.rst \
       intro.rst main.rst operations.rst patterns.rst scripting.rst \
       starting.rst summary.rst time-machine.rst using.rst \
       \
       guidelines.rst

RST2HTML_FLAGS = --toc-top-backlinks

all: index.html

index.html :  $(REST) Makefile
	rst2html.py $(RST2HTML_FLAGS) main.rst >index.html
