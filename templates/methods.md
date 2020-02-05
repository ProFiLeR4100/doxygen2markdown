<% if (Array.isArray(cc.methods) && cc.methods.length) { -%>
## Methods

<% cc.methods.forEach(function(method) { %>
#### <%= method.typeDef; %> <%- !!method.typeRef ? method.anchoredTypeRef : method.type; %> `<%= method.name; %><%- method.args; %>` <%- method.reimplementsAnchor; %> <a id='<%- method.anchor %>' href='#<%- method.anchor %>'>#</a>

<% 
if (Array.isArray(method.description) && method.description.length) { 
    method.description.forEach(function(description) {
        %>
<%= description %><%
    });
}

if (Array.isArray(method.paramDescription) && method.paramDescription.length) { 
%>

|Type|Member|Description|
|---|---|---|
<%
    method.paramDescription.forEach(function(kind) {
        if (kind.description) {
            %>| <%- kind.kind %> |  | <%- kind.description %> |
<%
        }
        if (Array.isArray(kind.parameters) && kind.parameters.length) {
            kind.parameters.forEach(function(parameter) {
                %>| <%- kind.kind %> | <%- parameter.name %> | <%- parameter.description %> |
<%
            });
        }
    });
} 
%>
<% }); -%>
<% } %>