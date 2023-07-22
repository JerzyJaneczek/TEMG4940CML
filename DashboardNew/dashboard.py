import matplotlib.pyplot as plt
from dash import Dash, html, dcc, Output, Input
import dash_bootstrap_components as dbc
import plotly.express as px
import pandas as pd
import numpy as np
from dash.dependencies import Output, Input

app = Dash(__name__, external_stylesheets=[dbc.themes.SOLAR])
df = px.data.medals_long()

# Data Processing
data = pd.read_csv("dataset.csv", sep="\t")
data = data.dropna()
Y = data["AcceptedCmp1"] + data["AcceptedCmp2"] + data["AcceptedCmp3"] + \
    data["AcceptedCmp4"] + data["AcceptedCmp5"] + data["Response"]

df = data

clean_data = pd.read_csv("data.csv")
# X_train, X_test, y_train, y_test = train_test_split(
#    clean_data, Y, test_size=0.2, random_state=42)

# Fit the models
# lr = LogisticRegression()
# lr.fit(X_train, y_train)
# dt = DecisionTreeClassifier()
# dt.fit(X_train, y_train)
# rf = RandomForestClassifier()
# rf.fit(X_train, y_train)

# # Make predictions on the test set
# lr_y_pred = lr.predict(X_test)
# dt_y_pred = dt.predict(X_test)
# rf_y_pred = rf.predict(X_test)

# # Calculate the predicted probabilities for the ROC curves
# lr_y_prob = lr.predict_proba(X_test)[:, 1]
# dt_y_prob = dt.predict_proba(X_test)[:, 1]
# rf_y_prob = rf.predict_proba(X_test)[:, 1]

myTitle = dcc.Markdown(children="Machine Learning Dashboard Graph")
myGraph = dcc.Graph(id="graph")
dropdown = dcc.Dropdown(options=["Bar", "Scatter", "Boxplot"],
                        value="Bar",
                        clearable=False,
                        id="graph_type")

tabs = html.Div(
    [
        dbc.Tabs(
            [
                dbc.Tab(label="Tab 1", tab_id="tab-1"),
                dbc.Tab(label="Tab 2", tab_id="tab-2"),
            ],
            id="tabs",
            active_tab="tab-1",
        ),
        html.Div(id="content"),
    ]
)


@app.callback(Output("content", "children"), [Input("tabs", "active_tab")])
def switch_tab(at):
    if at == "tab-1":
        return html.Div([
            dropdown,
            columnDropdown,
            myGraph
            # Add your content for Tab 1 here
        ])
    elif at == "tab-2":
        return html.Div([
            html.Img(
                src=r'/Users/jerzyjaneczek/Desktop/HKUST/Y2/Summer/TEMG4940/Dashboard/Q4/figure1.png', alt='image'),
            html.Img(
                src=r'/Users/jerzyjaneczek/Desktop/HKUST/Y2/Summer/TEMG4940/Dashboard/Q4/figure2.png', alt='image'),
            html.Img(
                src=r'/Users/jerzyjaneczek/Desktop/HKUST/Y2/Summer/TEMG4940/Dashboard/Q4/figure3.png', alt='image'),
            html.Img(
                src=r'/Users/jerzyjaneczek/Desktop/HKUST/Y2/Summer/TEMG4940/Dashboard/Q4/figure4.png', alt='image'),
        ])

    return html.P("This shouldn't ever be displayed...")


columnDropdown = dcc.Dropdown(options=[
    {'label': i, 'value': i} for i in df.columns


],
    value="ID",
    clearable=False,
    id="data_variable")

app.layout = dbc.Container([myTitle, tabs,
                            html.Div(id='content')])


# @ app.callback(
#     #Output("graph", "figure"),
#     Output('content', 'children'),
#     #Input("graph_type", "value"),
#     #Input("data_variable", "value"),
#     Input('tabs', 'value')
# )
# @app.callback(Output("content", "children"), [Input("tabs", "active_tab")])
# def switch_tab(at):
#     if at == "tab1":
#         return html.Div([
#             dropdown,
#             columnDropdown,
#             myGraph
#             # Add your content for Tab 1 here
#         ])
#     elif at == "tab2":
#         return
#     return html.P("This shouldn't ever be displayed...")


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


if __name__ == '__main__':
    app.run_server(debug=True)
