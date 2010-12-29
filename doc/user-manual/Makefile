
REST = advanced.rst broccoli.rst brocontrol.rst cluster.rst \
       intro.rst main.rst operations.rst patterns.rst scripting.rst \
       starting.rst summary.rst time-machine.rst using.rst \

DEST = html

RST2HTML       = docutils/rst2html-custom
RST2HTML_FLAGS = --toc-top-backlinks --stylesheet-path docutils/html4css1-custom.css

all: dest-dir index.html guidelines.html

clean:
	rm -rf $(DEST)

dest-dir:
	@install -d $(DEST)
    
index.html :  $(REST) Makefile
	$(RST2HTML) $(RST2HTML_FLAGS) main.rst >$(DEST)/index.html

guidelines.html : guidelines.rst Makefile
	$(RST2HTML) $(RST2HTML_FLAGS) guidelines.rst >$(DEST)/guidelines.html
