import React, { use, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/types/navigation";
import { useNotes, useDeleteNote } from "@/api/notes.queries";
import { Note } from "@/types/note";
import { authService } from "@/services/auth.service";
import { Ellipsis, EllipsisVertical, Minus, Search } from "lucide-react-native";
import { COLORS, SPACES } from "@/constant";
import { EnrichedTextInput } from "react-native-enriched";
import { FlashList } from "@shopify/flash-list";

type NavigationProp = NativeStackNavigationProp<AppStackParamList, "NotesList">;

export function NotesListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { data: notes, isLoading, isError, error, refetch } = useNotes();
  const deleteNoteMutation = useDeleteNote();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleLogout = async () => {
    await authService.signOut();
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteNoteMutation.mutate(id),
      },
    ]);
  };

  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("NoteEditor", {
          noteId: item.id,
          title: item.title,
        })
      }
    >
      <View style={styles.cardContent}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <Pressable
            style={{
              width: 30,
              height: 30,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <EllipsisVertical size={24} color={COLORS.black} />
          </Pressable>
        </View>

        <View
          style={{
            maxHeight: 150,
            overflow: "hidden",
            marginBottom: SPACES.s,
            marginTop: SPACES.xs,
          }}
        >
          <EnrichedTextInput
            style={{ fontSize: 14 }}
            defaultValue={item?.content.trim() || ""}
            editable={false}
            androidExperimentalSynchronousEvents={false}
          />
        </View>

        <View style={{ marginBottom: SPACES.s, flexDirection: "row" }}>
          <Minus strokeWidth={1} />
        </View>

        <Text style={styles.cardDate}>
          {new Date(item.updated_at).toLocaleDateString()}
        </Text>
      </View>
      {/* <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity> */}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Unable to load notes.</Text>
        <Text style={styles.errorSubtext}>
          Check your connection and try again.
        </Text>
        <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Notes</Text>

        <Pressable
          style={{
            backgroundColor: COLORS.white,
            width: 46,
            height: 46,
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
            borderCurve: "continuous",
          }}
        >
          <Ellipsis size={24} color={COLORS.black} />
        </Pressable>
        {/* <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.searchContainer}>
        <Search size={24} color={COLORS.black} />
        <TextInput placeholder="Search notes..." style={styles.searchInput} />
      </View>

      <FlashList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        masonry
        numColumns={2}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("NoteEditor", {})}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    paddingHorizontal: SPACES.m,
    paddingVertical: 8,
    borderRadius: 13,
    marginBottom: 8,
    borderCurve: "continuous",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  logoutText: {
    color: "red",
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: COLORS.white,
    marginBottom: 16,
    borderRadius: 13,
    paddingVertical: SPACES.l,
    paddingLeft: SPACES.l - 5,
    paddingRight: SPACES.l,
    borderCurve: "continuous",
    marginRight: SPACES.m,
  },
  cardContent: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
    paddingTop: 0,
    marginTop: 0,
  },
  cardDate: {
    fontSize: 12,
    color: COLORS.black,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    color: "red",
    fontSize: 14,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    lineHeight: 32,
    marginTop: -4,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginBottom: 8,
  },
  errorSubtext: {
    color: "#666",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#000",
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
  },
});
