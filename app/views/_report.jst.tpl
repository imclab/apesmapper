<!-- report backbone template -->
<div class="report_stats">

<% if(stats.carbon) { %>
<div class="block">
    <span class="title">
        <h2>CARBON</h2>
        <p><% print(number_format(stats.carbon.qty)); %><small>T</small></p>
    </span>
    <% if(stats.carbon) { %>
    <ul class="normal list">
      <% if(stats.carbon.countries.length === 0) { %>
        <ul><li class="last"></li></ul>
      <% } else { %>
          <% _.each(stats.carbon.countries, function(ct, idx) { %>
          <% if( idx == (stats.carbon.countries.length - 1)) { %>
          <li class="last">
          <% } else { %>
          <li>
          <% } %>
                <h5><%= ct.name %></h5>
                <p class="info"><% print(number_format(ct.qty)); %> T</p>
          </li>
          <% }); %>
      <% } %>
    </ul>
    <% } %>
</div>
<% } %>

<% if(stats.carbon_sequestration) { %>
<div class="block">
    <span class="title">
        <% if (stats.carbon_sequestration.qty.toFixed(0).length > 7) { %>
            <h2>C. SEQ.</h2>
        <% } else { %>
            <h2>C. SEQUESTRATION</h2>
        <% } %>
        <p><% print(number_format(stats.carbon_sequestration.qty)); %><small>T</small></p>
    </span>
    <ul class="normal list">
        <li></li>
    </ul>
</div>
<% } %>


<% if(stats.covered_by_PA && stats.carbon_sequestration) { %>
<div class="block">
    <span class="title">
        <h2>COVERED BY PAs</h2>
        <p><%= (1e8*stats.covered_by_PA.km2/stats.carbon_sequestration.area).toFixed(0) %><small>%</small></p>
    </span>
    <ul class="normal list">
      <li>
        Overlapping with <%= stats.covered_by_PA.num_overlap %> Protected Area(s)
      </li>
    </ul>
</div>
<% } %>

<% if(stats.covered_by_KBA) { %>
<div class="block">
    <span class="title">
        <h2>COVERED BY KBAs</h2>
        <p><%= stats.covered_by_KBA.percent.toFixed(0) %><small>%</small></p>
    </span>
    <ul class="normal list">
      <li>
        Overlapping with <%= stats.covered_by_KBA.num_overlap %> Key Biodiversity Area(s)
      </li>
  </ul> 
</div>
<% } %>

<% if(stats.restoration_potential) { %>
<div class="block">
    <span class="title">
        <h2>RESTORATION POTENTIAL</h2>
        <p>&nbsp;</p>
    </span>
    <ul class="inline list">
        <li>
            <h5>WIDE-SCALE</h5>
            <p class="info"><%=stats.restoration_potential.wide_scale.toFixed(1)%>%</p>
        </li>
        <li>
            <h5>MOSAIC</h5>
            <p class="info"><%=stats.restoration_potential.mosaic.toFixed(1) %>%</p>
        </li>
        <li>
            <h5>REMOTE</h5>
            <p class="info"><%=stats.restoration_potential.remote.toFixed(1) %>%</p>
        </li>
        <li class="last">
            <h5>NONE</h5>
            <p class="info"><%=stats.restoration_potential.none.toFixed(1) %>%</p>
        </li>
    </ul>
</div>
<% } %>

<% if(stats.conservation_priorities && stats.conservation_priorities.length > 0) { %>
<div class="block">
    <span class="title">
        <h2>CONSERVATION PRIORITIES</h2>
        <p>&nbsp;</p>
    </span>
    <% _.each(stats.conservation_priorities, function(area) { %>
    <span class="conservation_header"><p><%= area.name %></p></span>
    <ul class="inline list">
        <li>
            <h5>VERY-HIGH</h5>
            <p class="info"><%= area.percents[0].toFixed(1) %>%</p>
        </li>
        <li>
            <h5>HIGH</h5>
            <p class="info"><%= area.percents[1].toFixed(1)  %>%</p>
        </li>
        <li>
            <h5>MEDIUM</h5>
            <p class="info"><%= area.percents[2].toFixed(1)  %>%</p>
        </li>
        <li class="last">
            <h5>OUT</h5>
            <p class="info"><%= area.percents[4].toFixed(1)  %>%</p>
        </li>
    </ul>
    <% }); %>
</div>
<% } %>

<% if(stats.forest_status) { %>
<div class="block">
    <span class="title">
        <h2>FOREST STATUS</h2>
        <p>&nbsp;</p>
    </span>
    <ul class="normal list">
      <li><h5>% Defined as intact forest</h5><p class="info "><%= stats.forest_status.intact.toFixed(1) %>%</p></li>
      <li><h5>% Defined as fragmented/managed forest</h5><p class="info "><%= stats.forest_status.fragmented.toFixed(1) %>%</p></li>
      <li><h5>% Defined as partially deforested areas</h5><p class="info "><%= stats.forest_status.partial.toFixed(1) %>%</p></li>
      <li><h5>% Defined as deforested areas</h5><p class="info "><%= stats.forest_status.deforested.toFixed(1) %>%</p></li>
    </ul>
</div>
<% } %>


<% if(stats.carbon_sum) { %>
<div class="block">
    <span class="title">
        <h2 class="nohelp">CARBON</h2>
        <p><% print(number_format(stats.carbon_sum.qty)); %><small>T</small></p>
    </span>
    <ul class="normal list tooltip">
      <% _.each(stats.carbon_sum.polygons, function(p, idx) { %>
        <% if( idx == (stats.carbon_sum.polygons.length - 1)) { %>
        <li class="last">
        <% } else { %>
        <li>
        <% } %>
        <!-- tooltip -->

        <div class="list_tooltip_data">
          <h4><%= p.polygon %></h4>
          <span class="blue">
              <h6><%= number_format(p.carbon) %> T</h6>
            <p>Carbon</p>
          </span>
          <span class="white">
            <h6><%= number_format(p.carbon_sequestration) %>T</h6>
            <p>RestP: Max. Extra Carbon</p>
          </span>
        </div>

        <h5 class="stats"><%= p.polygon %></h5>
            <div class="stats_bar">
                <span class="r_bar" style="width: <%= p.percent %>%"></span>
                <div class="stats_bar inner" style="width: <%= p.percent_seq %>%">
                    <span class="r_bar"></span>
                </div>
            </div>
            <p><%= p.percent.toFixed(1) %>%</p>
        </li>
      <% }); %>
    </ul>
</div>
<% } %>

<% if(stats.coverage) { %>
<div class="block">
    <span class="title">
        <h2 class="nohelp">COVERAGE STATICTICS</h2>
        <p>&nbsp;</p>
    </span>
    <ul class="normal list">
      <% _.each(stats.coverage, function(v, k) { %>
        <li>
          <h5 class="stats"><%= k %></h5>
            <div class="stats_bar">
                <span class="r_bar" style="width: <%=v %>%"></span>
            </div>
            <p><%= v.toFixed(1) %>%</p>
        </li>
      <% }); %>
    </ul>
</div>
<% } %>


<% if(stats.conservation_priority_areas && stats.conservation_priority_areas.length > 0) { %>
<div class="block">
    <span class="title">
        <h2>CONSERVATION PRIORITIES</h2>
        <p>&nbsp;</p>
    </span>
    <ul class="down list">
        <% _.each(stats.conservation_priority_areas, function(area) { %>
        <li>
            <h5><%= area.name %></h5>
            <ul>
                <li class="hst">
                    <h6>Highest</h6>
                    <div class="stats_bar"><span class="r_bar" style="width: <%= area.percents[0] %>%"></span></div>
                </li>
                <li class="h">
                    <h6>High</h6>
                    <div class="stats_bar"><span class="r_bar" style="width: <%= area.percents[1] %>%"></span></div>
                </li>
                <li class="m">
                    <h6>Med</h6>
                    <div class="stats_bar"><span class="r_bar" style="width: <%= area.percents[2] %>%"></span></div>
                </li>
                <li class="l">
                    <h6>Low</h6>
                    <div class="stats_bar"><span class="r_bar" style="width: <%= area.percents[3] %>%"></span></div>
                </li>
                <li class="out">
                    <h6>Outs.</h6>
                    <div class="stats_bar"><span class="r_bar" style="width: <%= area.percents[4] %>%"></span></div>
                </li>
            </ul>
        </li>
      <% }); %>
    </ul>
</div>
<% } %>

<div style="padding-top: 60px; float:left;"></div>

</div> <!-- .report_stats -->
