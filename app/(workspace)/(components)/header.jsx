import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlayIcon,
  PauseIcon,
  StepForwardIcon,
  UndoIcon,
  RedoIcon,
  SaveIcon,
  ShareIcon,
  CodeIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeContext } from "./theme-provider";
import { ChatWindow } from "./chat-window";

export function Header() {
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const { theme, setTheme } = useContext(ThemeContext);

  const generateCode = (language) => {
    // This is a placeholder. In a real application, you'd generate the actual code based on the workflow.
    if (language === "python") {
      return `
import langgraph as lg

def data_fetching_agent():
 # Implement data fetching logic
 pass

def analysis_agent():
 # Implement analysis logic
 pass

def visualization_agent():
 # Implement visualization logic
 pass

workflow = lg.Graph()
workflow.add_node("data_fetching", data_fetching_agent)
workflow.add_node("analysis", analysis_agent)
workflow.add_node("visualization", visualization_agent)

workflow.add_edge("data_fetching", "analysis")
workflow.add_edge("analysis", "visualization")

result = workflow.run()
print(result)
 `;
    } else if (language === "javascript") {
      return `
// This is a placeholder for JavaScript code
const workflow = {
 dataFetching: () => {
 // Implement data fetching logic
 },
 analysis: () => {
 // Implement analysis logic
 },
 visualization: () => {
 // Implement visualization logic
 },
 run: function() {
 const data = this.dataFetching();
 const analysisResult = this.analysis(data);
 return this.visualization(analysisResult);
 }
};

const result = workflow.run();
console.log(result);
 `;
    }
  };

  const toggleTheme = () => {
    setTheme("light");
  };

  const handlePlayClick = () => {
    setIsChatWindowOpen(true);
  };

  return (
    <header className="bg-[#1A8DBE1A] h-16 border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center space-x-2">
        <Input placeholder="Untitled Workflow" className="w-64" />
        <Button variant="ghost" size="icon">
          <SaveIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <ShareIcon className="h-4 w-4" />
        </Button>
        <Dialog open={isCodeDialogOpen} onOpenChange={setIsCodeDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <CodeIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Generated Code</DialogTitle>
            </DialogHeader>
            <Tabs
              defaultValue="python"
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <TabsList>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              </TabsList>
              <TabsContent value="python">
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[400px]">
                  <code>{generateCode("python")}</code>
                </pre>
              </TabsContent>
              <TabsContent value="javascript">
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[400px]">
                  <code>{generateCode("javascript")}</code>
                </pre>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-[#1E3A5F] hover:bg-[#1E3A5F]"
        >
          <UndoIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-[#1E3A5F] hover:bg-[#1E3A5F]"
        >
          <RedoIcon className="h-4 w-4" />
        </Button>
        <div className="h-6 w-px bg-border mx-2" />
        <Button
          variant="outline"
          size="icon"
          className="bg-[#1E3A5F] hover:bg-[#1E3A5F]"
          onClick={handlePlayClick}
        >
          <PlayIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-[#1E3A5F] hover:bg-[#1E3A5F]"
        >
          <PauseIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-[#1E3A5F] hover:bg-[#1E3A5F]"
        >
          <StepForwardIcon className="h-4 w-4" />
        </Button>
        {/* <Button
          variant="outline"
          size="icon"
          className="bg-[#1E3A5F] hover:bg-[#1E3A5F]"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <MoonIcon className="h-4 w-4" />
          ) : (
            <SunIcon className="h-4 w-4" />
          )}
        </Button> */}
      </div>
      <ChatWindow
        isOpen={isChatWindowOpen}
        onClose={() => setIsChatWindowOpen(false)}
      />
    </header>
  );
}
