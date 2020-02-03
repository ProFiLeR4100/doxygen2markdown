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