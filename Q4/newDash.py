
import os
import dash
import dash_bootstrap_components as dbc
import numpy as np
import plotly.graph_objs as go
from dash import Input, Output, dcc, html, State
import pandas as pd
import plotly.express as px

app = dash.Dash(external_stylesheets=[dbc.themes.BOOTSTRAP])
server = app.server

image_path1 = 'figure1.png'
image_path2 = 'figure2.png'
image_path3 = 'figure3.png'
image_path4 = 'figure4.png'


data = pd.read_csv("dataset.csv", sep="\t")
data = data.dropna()
Y = data["AcceptedCmp1"] + data["AcceptedCmp2"] + data["AcceptedCmp3"] + \
    data["AcceptedCmp4"] + data["AcceptedCmp5"] + data["Response"]

df = data


myGraph = dcc.Graph(id="graph", figure={})
dropdown = dcc.Dropdown(options=["Bar", "Scatter", "Boxplot"],
                        value="Bar",
                        clearable=False,
                        id="graph_type")

columnDropdown = dcc.Dropdown(options=[
    {'label': i, 'value': i} for i in df.columns
],
    value="ID",
    clearable=False,
    id="data_variable")

images = html.Div(
    [
        html.Img(
            src=app.get_asset_url('assets/figure1.png'))
        html.Img(
            src='assets/figure2.png', alt='image'),
        html.Img(
            src='./assets/figure3.png', alt='image'),
        html.Img(
            src='/assets/figure4.png', alt='image'),
    ]
)

images2 = html.Div(
    [
        html.Img(
            src='/assets/Shap.png', alt='image'),
        html.Img(
            src='/assets/ShapAnalysis.png', alt='image'),
    ]
)

app.layout = dbc.Container(
    [
        dcc.Store(id="store"),
        html.H1("ML Dashboard"),
        html.Hr(),
        dbc.Button(
            "Regenerate graphs",
            color="primary",
            id="button",
            className="mb-3",
        ),
        dbc.Tabs(
            [
                dbc.Tab(label="Q1", tab_id="q1"),
                dbc.Tab(label="Q4", tab_id="q4"),
                dbc.Tab(label="Q6", tab_id="q6"),
            ],
            id="tabs",
            active_tab="q1",
        ),
        html.Div(id="tab-content", className="p-4"),
    ]
)


@ app.callback(
    Output("tab-content", "children"),
    [Input("tabs", "active_tab"), Input("store", "data")],
)
def render_tab_content(active_tab, data):
    if active_tab and data is not None:
        if active_tab == "q1":
            return [dropdown, columnDropdown, myGraph]
        elif active_tab == "q4":
            return images
        elif active_tab == "q6":
            return images2

    return "No tab selected"


@ app.callback(Output("store", "data"), [Input("button", "n_clicks")])
def generate_graphs(n):
    """
    This callback generates three simple graphs from random data.
    """
    if not n:
        # generate empty graphs when app loads
        return {k: go.Figure(data=[]) for k in ["scatter", "hist_1", "hist_2"]}

    # simulate expensive graph generation process
    time.sleep(2)

    # generate 100 multivariate normal samples
    data = np.random.multivariate_normal([0, 0], [[1, 0.5], [0.5, 1]], 100)

    scatter = go.Figure(
        data=[go.Scatter(x=data[:, 0], y=data[:, 1], mode="markers")]
    )
    hist_1 = go.Figure(data=[go.Histogram(x=data[:, 0])])
    hist_2 = go.Figure(data=[go.Histogram(x=data[:, 1])])

    # save figures in a dictionary for sending to the dcc.Store
    return {"scatter": scatter, "hist_1": hist_1, "hist_2": hist_2}


@ app.callback(Output("graph", "figure"),
               Input("graph_type", "value"),
               Input("data_variable", "value"),)
def update_graph(graph_type, data_variable):
    # Check if the column is of type int64 or float64
    if graph_type == "Bar":
        fig = px.histogram(data_frame=df, x=df[data_variable],
                           title="Bar Chart of " + data_variable)

    elif graph_type == "Scatter":
        fig = px.scatter(data_frame=df, x=df[data_variable], y=Y,
                         title="Scatter Plot of " + data_variable)

    elif graph_type == "Boxplot":
        fig = px.box(data_frame=df, y=df[data_variable],
                     title="Scatter Plot of " + data_variable)

    return fig


if __name__ == "__main__":
    app.run_server(debug=True)
