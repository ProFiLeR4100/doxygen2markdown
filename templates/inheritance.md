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