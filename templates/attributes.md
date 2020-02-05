<% if (Array.isArray(cc.attributes) && cc.attributes.length) { -%>
## Attributes

<% 
    cc.attributes.forEach(function(attribute) { 
%>
#### <%= attribute.typeDef; %> <%- !!attribute.typeRef ? attribute.anchoredTypeRef : attribute.type; %> `<%= attribute.name; %>` <%- attribute.initializer; %> <a id='<%- attribute.anchor %>' href='#<%- attribute.anchor %>'>#</a>

<%- attribute.description ? attribute.description : '' %>
<% 
    }); 
} -%>

<% if (Array.isArray(cc.properties) && cc.properties.length) { -%>
## Properties

<% 
    cc.properties.forEach(function(property) { 
%>
#### <%= property.typeDef; %> <%- !!property.typeRef ? property.anchoredTypeRef : property.type; %> `<%= property.name; %>` <%- property.initializer; %> <a id='<%- property.anchor %>' href='#<%- property.anchor %>'>#</a>

<%- property.description ? property.description : '' %>
<% }); 
} -%>