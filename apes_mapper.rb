# Bundler
require "rubygems"
require "bundler/setup"
Bundler.require
require './app/models/database.rb'
require 'sinatra/backbone'
require 'sinatra/assetpack'
require "compass"
require 'sinatra/support'
require 'net/http'
class ApesMapper < Sinatra::Base
  set :sass, Compass.sass_engine_options
  set :sass, { :load_paths => sass[:load_paths] + [ "#{ApesMapper.root}/app/assets/css" ] }

  set :scss, sass

  register Sinatra::JstPages
  serve_jst '/jst.tpl'
  BASE_ID = 111222333

    # This is a convenient way of setting up Compass in a Sinatra
  # project without mucking around with load paths and such.
  register Sinatra::CompassSupport

  #Don't forget to check this :D
  #configure do
  #  use Rack::Session::Cookie, :secret => "ajshdaskjdmzxc,znc,mzxopewriumzxn,cjksdfh 93048 jchz xcm,bn3284 zxcnbz xcn,blkdsfj qp9 kh dlsakk zcvn"
  #  use Rack::Csrf, :raise => true
  #end

  # Assetpack
  set :root, File.dirname(__FILE__)
  register Sinatra::AssetPack

  assets {
    js_compression :uglify
    
    serve '/js',     from: 'app/assets/js'        # Optional
    serve '/css',    from: 'app/assets/css'       # Optional
    serve '/img', from: 'app/assets/img'          # Optional

    # The second parameter defines where the compressed version will be served.
    # (Note: that parameter is optional, AssetPack will figure it out.)
    js :main_app, '/js/main_app.js', [
      '/js/moochart-0.1b1.js',
      '/js/libs/jquery.mousewheel.js',
      '/js/libs/jquery.jscrollpane.js',
      '/js/libs/underscore-min.js',
      '/js/libs/class.js',
      '/js/libs/backbone.js',
      '/js/libs/wax.g.js',
      '/js/libs/cartodb-gmapsv3.js',

      "/js/app.js",
      "/js/modules/log.js",
      "/js/modules/config.js",
      "/js/modules/bus.js",
      "/js/modules/map.js",
      "/js/modules/species.js",
      "/js/modules/apes.js",
      "/js/modules/categories.js",
      "/js/modules/regions.js",
      "/js/modules/countries.js",
      "/js/modules/species_ials.js",

      "/js/views/projector.js",
      "/js/views/map.js",
      "/js/views/layers.js",
      "/js/views/sharepopup.js",
      "/js/views/searchbox.js",
      "/js/views/filter_edit.js",
      "/js/views/filter_apes.js",
      "/js/views/filter_species.js",
      "/js/views/filter_regions.js",
      "/js/views/filter_countries.js",
      "/js/views/selected_species_countries.js",
      "/js/views/slide_filters.js",
      "/js/views/graph.js",
      "/js/views/result_summary.js",
      "/js/views/table.js",
      '/js/carbon.js',
      '/js/jquery.main.js'
    ]

    css :application, [
      '/css/all.css'
    ]

    js_compression  :uglify      # Optional
    css_compression :sass        # Optional
  }
  
  helpers do
    def csrf_token
      Rack::Csrf.csrf_token(env)
    end

    def csrf_tag
      Rack::Csrf.csrf_tag(env)
    end
  end

  set :views, Proc.new{ File.join(root, 'app', 'views') }
  enable :logging, :dump_errors, :raise_errors
  enable :show_exceptions if development?

  get '/' do
    erb :home
  end

  get '/about' do
    erb :about
  end

  get '/tool' do
    erb :index
  end

  get '/data' do
    erb :data
  end

  get '/nojavascript' do
    erb :nojs
  end
  
  get '/ie6' do
    erb :ie6
  end

  post '/csv' do
    require 'net/http'
    require 'uri'

    file_name = "ApesMapper_sites_#{Time.now.strftime("%y%m%d%H%M")}"
    headers "Content-Disposition" => "attachment;filename=#{file_name}.csv", "Content-Type" => "application/octet-stream"

    url = URI.escape "http://carbon-tool.cartodb.com/api/v1/sql?q=#{params[:q]}"
    uri = URI.parse url
    res = Net::HTTP.get_response(uri)
    body = JSON.parse(res.body)

    # Build the title string, with the users filter values in
    titles = "IAS ID, Name, Category"

    titles << ", Area KM2 "
    titles << "(#{params[:sizeMin]} - #{params[:sizeMax]})" unless [params[:sizeMin],params[:sizeMax]].include?('undefined')

    titles << ", Pressure, Habitat" 

    titles << ", Response "
    titles << "(#{params[:responseMin]} - #{params[:responseMax]})" unless [params[:responseMin],params[:responseMax]].include?('undefined')


    titles << ", Biodiversity "
    titles << "(#{params[:biodiversityMin]} - #{params[:biodiversityMax]})" unless [params[:biodiversityMin],params[:biodiversityMax]].include?('undefined')

    titles << ", Analysis Taxa Present, Driving Taxon, Taxon-Site Overlap, Uncertainty\n"

    result = titles
    body['rows'].each do |row|
      result << "#{row['ial_id']},#{row['name']},#{row['category']},#{row['area_km2']},#{row['pressure_score']},#{row['habitat_score']},#{row['response_score']},#{row['biodiversity_score']}, -,#{row['species']},#{row['taxon_site_overlap']},#{row['uncertainty_score']}\n"
    end
    result
  end

  post '/species_ials_csv' do
    require 'net/http'
    require 'uri'

    file_name = "ApesMapper_species_occurences_#{Time.now.strftime("%y%m%d%H%M")}"
    headers "Content-Disposition" => "attachment;filename=#{file_name}.csv", "Content-Type" => "application/octet-stream"

    url = URI.escape "http://carbon-tool.cartodb.com/api/v1/sql?q=#{params[:q]}"
    uri = URI.parse url
    res = Net::HTTP.get_response(uri)
    body = JSON.parse(res.body)

    # Build the title string, with the users filter values in
    titles = "IAS ID, Name, Category"

    titles << ", Area KM2 "
    titles << "(#{params[:sizeMin]} - #{params[:sizeMax]})" unless [params[:sizeMin],params[:sizeMax]].include?('undefined')

    titles << ", Pressure, Habitat" 

    titles << ", Response "
    titles << "(#{params[:responseMin]} - #{params[:responseMax]})" unless [params[:responseMin],params[:responseMax]].include?('undefined')

    titles << ", Biodiversity "
    titles << "(#{params[:biodiversityMin]} - #{params[:biodiversityMax]})" unless [params[:biodiversityMin],params[:biodiversityMax]].include?('undefined')

    titles << ", Analysis Taxa Present, Driving Taxon, Taxon-Site Overlap, Uncertainty\n"

    result = titles
    body['rows'].each do |row|
      result << "#{row['ial_id']},#{row['name']},#{row['category']},#{row['area_km2']},#{row['pressure_score']},#{row['habitat_score']},#{row['response_score']},#{row['biodiversity_score']}, -,#{row['species']},#{row['taxon_site_overlap']},#{row['uncertainty_score']}\n"
    end
    result
  end

  before '/api/v0/work/:work_hash' do
    content_type "application/json"
    if params[:work_hash] && params[:work_hash] != "undefined"
      @w = Work.find(params[:work_hash].alphadecimal - BASE_ID)
    else
      @w = nil
    end
  end

  post '/api/v0/work' do
    content_type "application/json"
    w = Work.create
    {'id' => (w.id + BASE_ID).alphadecimal }.to_json
  end

  put '/api/v0/work/:work_hash' do
    if @w
      @w.json = params["data"]
      @w.save
      data = params["data"]
    end
  end

  get '/api/v0/work/:work_hash' do
    if @w
      @w.json
    else
      data = '{"error": "does not exist"}'
      status = 404
    end
  end

  delete '/api/v0/work/:work_hash' do
    if @w
      @w.delete
      status = 204
      data = ''
    end
  end

  post '/api/v0/error' do
    Error.create(:error => params)
    "Logged, thanks!"
  end

  error do
    "Sorry there was a nasty error - " + env['sinatra.error'].name
  end
end
