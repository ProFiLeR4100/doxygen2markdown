# <%- compound.kind %> `<%= compound.compoundname %>`

```
<%= compound.kind %> <%= compound.compoundname %>
<%  if (compound.basecompoundref) { -%>
<%      if (Array.isArray(compound.basecompoundref)) { -%>
<%          compound.basecompoundref.forEach(function(basecompoundref) { -%>
    : <%- basecompoundref.prot %> <%- basecompoundref.$t %>
<%          }); -%>
<%      } else { -%>
    : <%- compound.basecompoundref.prot %> <%- compound.basecompoundref.$t -%>
<%      } -%> 
<% } -%> 
```

<%= !!compound.briefdescription.para ? compound.briefdescription.para : '' %>

## Summary

<%  
if (Array.isArray(compound.sectiondef)) { %>
|Members|Descriptions|
|---|---| 
<%  compound.sectiondef.forEach(function(sectiondef) {
        if (Array.isArray(sectiondef.memberdef)) {
            sectiondef.memberdef.forEach(function(memberdef) { %>|<%
                if (memberdef.kind=='property') {
                    %>`<%= memberdef.kind %>` <%
                }
                
                %><%= memberdef.prot %> <%
                if (memberdef.static=="yes") { %>static <% }
                if (memberdef.const=="yes") { %>const <% }
                if (memberdef.virt=="virtual") { %>virtual <% }
                
                %><%= !!memberdef.type && !!memberdef.type.ref ? memberdef.type.ref.$t : memberdef.type %> <%
                %>[<%= memberdef.name %>](#<%- memberdef.id %>)<%
                
                if (memberdef.kind==='function') {
                    %><%= memberdef.argsstring %><%
                }
                
                %>|<%= !!memberdef.briefdescription.para ? memberdef.briefdescription.para : '' %><%
                %>|
<%
            });
        }
    });
} %>
  
## Members

<%  
if (Array.isArray(compound.sectiondef)) {
    compound.sectiondef.forEach(function(sectiondef) {
        if (Array.isArray(sectiondef.memberdef)) {
            sectiondef.memberdef.forEach(function(memberdef) {
                %>#### <%= memberdef.prot %> <%
                if (memberdef.static=="yes") { %>static <% }
                if (memberdef.const=="yes") { %>const <% }
                if (memberdef.virt=="virtual") { %>virtual <% }
                
                %><%# TODO: ADD LINK TO REF %><%= !!memberdef.type && !!memberdef.type.ref ? memberdef.type.ref.$t : memberdef.type %> <%
                %>[<%= memberdef.name %>](#<%- memberdef.id %>)<%
                
                if (memberdef.kind==='function') {
                    %><%= memberdef.argsstring %><%
                }
            
                %><span id='<%- memberdef.id %>'></span>

<%              %><%= !!memberdef.briefdescription.para ? memberdef.briefdescription.para : ''; %>

<%              if (memberdef.initializer) { %>Default value <%= !!memberdef.initializer ? memberdef.initializer : ''; %>

<%              }

                %>Parameters
                <%# TODO: ADD PARAMETERS %>
<%
            });
        }
    }); 
} %>