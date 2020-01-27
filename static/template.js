{% raw -%}
  {{#each values}}
    <div class="message">
      <b>{{ this.messenger }}</b>{{this.timestamp}}<br>
      {{ this.message }}
    </div>
  {{/each}}
{%- endraw %}
