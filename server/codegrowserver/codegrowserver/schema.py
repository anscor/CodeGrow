import graphene

from users.schema import Query as UsersQuery
from problems.schema import Query as ProblemQuery
from codes.schema import Query as CodeQuery

from users.schema import Mutation as UsersMutation


class Query(UsersQuery, ProblemQuery, CodeQuery, graphene.ObjectType):
    pass


class Mutation(UsersMutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
