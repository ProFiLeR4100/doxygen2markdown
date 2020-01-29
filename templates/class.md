# <%- compound.kind %> `<%= compound.compoundname %>`

```
<%= compound.kind %> <%= compound.compoundname %>
<%  
if (cc.hierarchy) { 
    cc.hierarchy.forEach(function(hierarchyItem) { 
    
-%>
    : <%- hierarchyItem %>
<%

    });
} -%> 
```

<%= !!compound.briefdescription.para ? compound.briefdescription.para : '' %>

<% if (Array.isArray(cc.summary) && cc.summary.length) { -%>
## Summary

|Member|Description|
|---|---|<%  
    cc.summary.forEach(function(summaryItem) {
        %>
        | <%= summaryItem.typeDef; %> <%= !!summaryItem.typeRef ? summaryItem.anchoredTypeRef : summaryItem.type; %> <%= summaryItem.anchoredName; %> | <%= summaryItem.description; %> |<% 
    }); 
} %>


<% if (Array.isArray(cc.attributes) && cc.attributes.length) { -%>
## Attributes

<% cc.attributes.forEach(function(attribute) { %>
#### <%= attribute.typeDef; %> <%- !!attribute.typeRef ? attribute.anchoredTypeRef : attribute.type; %> `<%= attribute.name; %>` <%= attribute.initializer; %> <a id='<%- attribute.anchor %>' href='#<%- attribute.anchor %>'>#</a>
<%= attribute.description ? attribute.description : '' -%>
<% }); -%>
<% } %>


<% if (Array.isArray(cc.properties) && cc.properties.length) { -%>
## Properties

<% cc.properties.forEach(function(property) { %>
#### <%= property.typeDef; %> <%- !!property.typeRef ? property.anchoredTypeRef : property.type; %> `<%= property.name; %>` <%= property.initializer; %> <a id='<%- property.anchor %>' href='#<%- property.anchor %>'>#</a>
<%= property.description ? property.description : '' -%>
<% }); -%>
<% } %>


<% if (Array.isArray(cc.methods) && cc.methods.length) { -%>
## Methods

<% cc.methods.forEach(function(method) { %>
#### <%= method.typeDef; %> <%- !!method.typeRef ? method.anchoredTypeRef : method.type; %> `<%= method.name; %><%- method.args; %>` <%- method.reimplementsAnchor; %> <a id='<%- method.anchor %>' href='#<%- method.anchor %>'>#</a>

<% 
if (Array.isArray(method.description) && method.description.length) { 
    method.description.forEach(function(description) {
        %>
<%= description %>
        <% 
    });
}
%>


<% 
if (Array.isArray(method.paramDescription) && method.paramDescription.length) { 
%>
|Type|Member|Description|
|---|---|---|
<%
    method.paramDescription.forEach(function(kind) {
        if (Array.isArray(kind.parameters) && kind.parameters.length) {
            kind.parameters.forEach(function(parameter) {
                %>|<%- kind.kind %>|<%- parameter.name %>|<%- parameter.description %>|
                <%                
            });
        }
    });
} 
%>
<% }); -%>
<% } %>
